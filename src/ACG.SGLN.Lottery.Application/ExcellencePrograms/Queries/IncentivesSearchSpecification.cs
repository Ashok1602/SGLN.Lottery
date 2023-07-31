using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.ExcellencePrograms.Queries.GetIncentives;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Announcements.Queries
{
    public class IncentivesSearchSpecification : BaseSpecification<Incentive>
    {
        public IncentivesSearchSpecification(GetIncentivesQuery request)
        {
            if (request.Criterea.StartDate.HasValue)
                AddCriteria(s => s.Created.Date >= request.Criterea.StartDate.Value.Date);
            if (request.Criterea.EndDate.HasValue)
                AddCriteria(s => s.Created.Date <= request.Criterea.EndDate.Value.Date);
            if (request.Criterea.MinGoal != 0)
                AddCriteria(t => t.Goal >= request.Criterea.MinGoal);
            if (request.Criterea.MaxGoal != 0)
                AddCriteria(t => t.Goal <= request.Criterea.MaxGoal);
            if (request.Criterea.MinAchievement != 0)
                AddCriteria(t => t.Achievement >= request.Criterea.MinAchievement);
            if (request.Criterea.MaxAchievement != 0)
                AddCriteria(t => t.Achievement <= request.Criterea.MaxAchievement);
            if (request.Criterea.RetailerId.HasValue)
                AddCriteria(t => t.RetailerId == request.Criterea.RetailerId);
            AddInclude(u => u.Retailer);
        }
    }
}