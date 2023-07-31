using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Queries.GetTrainingSlidesById
{
    public class GetTrainingSlidesByIdQuery : IRequest<InteractiveTrainingDocumentVm>
    {
        public Guid Id { get; set; }
    }

    public class GetTrainingSlidesByIdQueryHandler : IRequestHandler<GetTrainingSlidesByIdQuery, InteractiveTrainingDocumentVm>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;

        public GetTrainingSlidesByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<InteractiveTrainingDocumentVm> Handle(GetTrainingSlidesByIdQuery request,
            CancellationToken cancellationToken)
        {
            var interactiveTrainingDocument = await _context.Set<Training>()
                .Where(r => r.Id == request.Id)
                .Include(t => t.Module)
                .Select(e => new InteractiveTrainingDocumentVm()
                {
                    ModuleName = e.Module.Title,
                    TrainingTitle = e.Title
                }).FirstOrDefaultAsync();

            if (interactiveTrainingDocument == null)
                throw new NotFoundException(nameof(InteractiveTrainingDocumentVm), request.Id);

            var slides = await _context.Set<TrainingDocument>()
                .Where(r => r.TrainingId == request.Id)
                .OrderByDescending(t => t.Created)
                .Select(e => new InteractiveTrainingCourseSlideVm
                {
                    Id = e.Id,
                    Type = e.Type,
                    Title = e.Title,
                    Body = e.Body
                }).ToListAsync();

            interactiveTrainingDocument.ListTrainingCourseSlide = slides;

            return interactiveTrainingDocument;

        }
    }
}
