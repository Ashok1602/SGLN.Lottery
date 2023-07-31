using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.TrainingModules.Queries.GetTrainingModules
{
    public class GetTrainingModulesQuery : IRequest<List<TrainingModuleDTO>>
    {
    }

    public class GetTrainingModulesQueryHandler : IRequestHandler<GetTrainingModulesQuery, List<TrainingModuleDTO>>,
        IApplicationRequestHandler<GetTrainingModulesQuery, List<TrainingModuleDTO>>
    {
        private readonly IApplicationDbContext _context;

        public GetTrainingModulesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<List<TrainingModuleDTO>> Handle(GetTrainingModulesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Set<TrainingModule>().Include(t => t.Trainings)
                .Select(e => new TrainingModuleDTO
                {
                    Id = e.Id,
                    Title = e.Title,
                    CountTrainings = e.Trainings.Count(),
                    Created = e.Created
                }).OrderBy(t => t.Title).ToListAsync();
        }
    }
}
