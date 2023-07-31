using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetIncentivesReport;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Reporting
{
    public class IncentivesReportSearchSpecification : BaseSpecification<Incentive>
    {
        public IncentivesReportSearchSpecification(GetIncentivesReportQuery request)
        {
            AddInclude(u => u.Retailer);

            AddCriteria(t => t.Created >= request.FromDate);
            AddCriteria(t => t.Created <= request.ToDate);
            AddCriteria(t => t.Type == request.Criterea.Type);

        }
    }
}