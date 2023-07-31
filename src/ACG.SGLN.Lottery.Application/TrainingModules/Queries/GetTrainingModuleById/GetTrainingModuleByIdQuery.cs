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

namespace ACG.SGLN.Lottery.Application.TrainingModules.Queries.GetTrainingModuleById
{
    public class GetTrainingModuleByIdQuery : IRequest<TrainingModule>
    {
        public Guid Id { get; set; }
    }

    public class GetTrainingModuleByIdQueryHandler : IRequestHandler<GetTrainingModuleByIdQuery, TrainingModule>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;

        public GetTrainingModuleByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TrainingModule> Handle(GetTrainingModuleByIdQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Set<TrainingModule>()
                .Where(r => r.Id == request.Id)
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(TrainingModule), request.Id);

            return entity;
        }
    }
}