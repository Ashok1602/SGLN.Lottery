using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.Trainings.Queries.GetAllTrainings;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;

namespace ACG.SGLN.Lottery.Application.Trainings.Queries
{
    public class RetailerTrainingsSearchSpecification : BaseSpecification<Training>
    {
        public RetailerTrainingsSearchSpecification(GetRetailerTrainingsQuery request)
        {
            AddInclude(r => r.RetailerTrainings);
            AddInclude("RetailerTrainings.Retailer.Documents");
            AddInclude(r => r.Documents);

            if (request.IsPublished.HasValue)
                AddCriteria(s => s.IsPublished == true);

            if (request.Criterea.TrainingType.HasValue)
            {
                AddCriteria(s => s.Type == request.Criterea.TrainingType.Value);

                if (request.Criterea.TrainingType.Value == TrainingType.Interactive && request.Criterea.ModuleId.HasValue)
                    AddCriteria(s => s.ModuleId == request.Criterea.ModuleId.Value);

                if (request.Criterea.TrainingType.Value == TrainingType.Live)
                {
                    if (request.Criterea.MinEndDate.HasValue)
                        AddCriteria(s => s.EndDate >= request.Criterea.MinEndDate.Value);

                    if (request.Criterea.MaxEndDate.HasValue)
                        AddCriteria(s => s.EndDate <= request.Criterea.MaxEndDate.Value);

                    if (request.Criterea.MinStartDate.HasValue)
                        AddCriteria(s => s.StartDate >= request.Criterea.MinStartDate.Value);

                    if (request.Criterea.MaxStartDate.HasValue)
                        AddCriteria(s => s.StartDate <= request.Criterea.MaxStartDate.Value);
                }
            }

            ApplyOrderBy(r => r.Created);
        }
    }
}