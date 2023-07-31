using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.TrainingModules.Queries.GetStrippedTrainingModules
{
    public class GetStrippedTrainingModulesQuery : IRequest<List<IdValueDto<Guid>>>
    {
    }

    public class GetAllTrainingModulesQueryHandler : IRequestHandler<GetStrippedTrainingModulesQuery, List<IdValueDto<Guid>>>,
        IApplicationRequestHandler<GetStrippedTrainingModulesQuery, List<IdValueDto<Guid>>>
    {
        private readonly IApplicationDbContext _context;

        public GetAllTrainingModulesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<IdValueDto<Guid>>> Handle(GetStrippedTrainingModulesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Set<TrainingModule>()
                .OrderBy(t => t.Title)
                .Select(e => new IdValueDto<Guid>
                {
                    Id = e.Id,
                    Value = e.Title
                })
                .ToListAsync();
        }
    }
}
