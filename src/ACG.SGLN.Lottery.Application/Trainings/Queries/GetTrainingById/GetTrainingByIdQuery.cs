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

namespace ACG.SGLN.Lottery.Application.Trainings.Queries.GetTrainingById
{
    public class GetTrainingByIdQuery : IRequest<Training>
    {
        public Guid Id { get; set; }
    }

    public class GetTrainingByIdQueryHandler : IRequestHandler<GetTrainingByIdQuery, Training>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;

        public GetTrainingByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Training> Handle(GetTrainingByIdQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Set<Training>()
                .Where(r => r.Id == request.Id)
                .Include(r => r.Questions)
                .Include(r => r.Documents)
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Training), request.Id);

            return entity;
        }
    }
}