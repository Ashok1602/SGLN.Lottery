using ACG.SGLN.Lottery.Application.Announcements.Queries;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.ExcellencePrograms.Queries.GetIncentives
{
    public class GetIncentivesQuery : IRequest<List<IncentiveDto>>
    {
        public IncentiveCriterea Criterea { get; set; } = new IncentiveCriterea();

    }

    public class GetIncentivesQueryHandler : IRequestHandler<GetIncentivesQuery, List<IncentiveDto>>,
        IApplicationRequestHandler<GetIncentivesQuery, List<IncentiveDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetIncentivesQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<IncentiveDto>> Handle(GetIncentivesQuery request,
            CancellationToken cancellationToken)
        {
            if (_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Retailers))
            {
                Retailer retailer = _context.Set<Retailer>()
                                   .Where(r => r.UserId == _currentUserService.UserId)
                                   .FirstOrDefault();
                if (retailer == null)
                    throw new InvalidOperationException("L'utilisateur courant n'a pas accès aux incentives");
                request.Criterea.RetailerId = retailer.Id;
            }

            List<IncentiveDto> data = await _context.ApplySpecification
               (new IncentivesSearchSpecification(request))
               .OrderByDescending(vp => vp.Created)
               .Select(vp => GetIncentiveItem(vp))
               .ToListAsync();

            return data;
        }

        private static IncentiveDto GetIncentiveItem(Incentive inc)
        {
            return new IncentiveDto
            {
                Type = inc.Type,
                StartDate = inc.StartDate.ToString("dd/MM/yyyy"),
                EndDate = inc.EndDate.ToString("dd/MM/yyyy"),
                Goal = inc.Goal,
                Achievement = inc.Achievement,
                AchievementRate = inc.Goal != 0 ? (inc.Achievement / inc.Goal) * 100 : 0,
                Remains = inc.Goal - inc.Achievement,
                Bonus = inc.Bonus
            };
        }
    }
}