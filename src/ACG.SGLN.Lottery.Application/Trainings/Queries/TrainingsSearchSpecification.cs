using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.Trainings.Queries.GetAllTrainings;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;

namespace ACG.SGLN.Lottery.Application.Trainings.Queries
{
    public class TrainingsSearchSpecification : BaseSpecification<Training>
    {
        public TrainingsSearchSpecification(GetTrainingsQuery request)
        {
            if (request.Criterea.StartDate.HasValue)
                AddCriteria(s => s.Created.Date >= request.Criterea.StartDate.Value.Date);

            if (request.Criterea.EndDate.HasValue)
                AddCriteria(s => s.Created.Date <= request.Criterea.EndDate.Value.Date);

            if (!string.IsNullOrEmpty(request.Criterea.Filter))
                AddCriteria(s => s.Title.Contains(request.Criterea.Filter));

            if (request.Criterea.TrainingType.HasValue)
            {
                AddCriteria(s => s.Type == request.Criterea.TrainingType.Value);

                if (request.Criterea.TrainingType.Value == TrainingType.Interactive && request.Criterea.ModuleId.HasValue)
                    AddCriteria(s => s.ModuleId == request.Criterea.ModuleId.Value);
            }


        }
    }
}