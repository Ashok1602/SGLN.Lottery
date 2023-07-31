using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetTrainingsByRetailerReport;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Reporting
{
    public class TrainingsByRetailerReportSearchSpecification : BaseSpecification<RetailerTraining>
    {
        public TrainingsByRetailerReportSearchSpecification(GetTrainingsByRetailerReportQuery request)
        {
            AddInclude(u => u.Statuses);
            AddCriteria(t => t.Created >= request.FromDate);
            AddCriteria(t => t.Created <= request.ToDate);
            AddInclude(u => u.Training);
            AddInclude("Training.Module");
            if (request.Criterea.RetailerId.HasValue)
                AddCriteria(t => t.Retailer.Id == request.Criterea.RetailerId);
            AddInclude(u => u.Retailer);

            if (!string.IsNullOrEmpty(request.Criterea.InternalRetailerCode))
                AddCriteria(vp => vp.Retailer.InternalRetailerCode == request.Criterea.InternalRetailerCode);
        }
    }
}