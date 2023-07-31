using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetTrainingsByModuleReport;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Reporting
{
    public class TrainingsByModuleReportSearchSpecification : BaseSpecification<RetailerTraining>
    {
        public TrainingsByModuleReportSearchSpecification(GetTrainingsByModuleReportQuery request)
        {
            AddInclude(u => u.Statuses);
            AddCriteria(t => t.Created >= request.FromDate);
            AddCriteria(t => t.Created <= request.ToDate);
            AddInclude(u => u.Training);
            AddInclude("Training.Module");
            if (request.Criterea.ModuleId.HasValue)
                AddCriteria(t => t.Training.Module.Id == request.Criterea.ModuleId.Value);
            AddInclude(u => u.Retailer);

            if (!string.IsNullOrEmpty(request.Criterea.Training))
                AddCriteria(vp => vp.Training.Title.Contains(request.Criterea.Training));
        }
    }
}