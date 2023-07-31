using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.Requests.Queries.GetRequests;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Requests.Queries
{
    public class RequestsSearchSpecification : BaseSpecification<Request>
    {
        public RequestsSearchSpecification(GetRequestsQuery request)
        {
            AddInclude(r => r.Retailer);
            AddInclude(r => r.RequestCategory);

            if (!string.IsNullOrEmpty(request.Criterea.Retailer))
                AddCriteria(s => s.Retailer.UserId == request.Criterea.Retailer);

            if (request.Criterea.RequestAssignedTo != null)
                AddCriteria(s => request.Criterea.RequestAssignedTo.Contains(s.RequestAssignedTo));

            if (request.Criterea.IsNotified.HasValue)
                AddCriteria(s => s.Retailer.IsNotified == request.Criterea.IsNotified.Value);

            if (!string.IsNullOrEmpty(request.Criterea.FirstName))
                AddCriteria(s => s.Retailer.FirstName.Contains(request.Criterea.FirstName));

            if (!string.IsNullOrEmpty(request.Criterea.LastName))
                AddCriteria(s => s.Retailer.LastName.Contains(request.Criterea.LastName));

            if (!string.IsNullOrEmpty(request.Criterea.Phone))
                AddCriteria(s => s.Retailer.Phone.Contains(request.Criterea.Phone));

            if (request.Criterea.RequestNature.HasValue)
                AddCriteria(s => s.RequestNature == request.Criterea.RequestNature.Value);

            if (request.Criterea.ProcessingDirection.HasValue)
                AddCriteria(s => s.ProcessingDirection == request.Criterea.ProcessingDirection.Value);

            if (!string.IsNullOrEmpty(request.Criterea.RequestObject))
                AddCriteria(s => s.RequestObject == request.Criterea.RequestObject);

            if (request.Criterea.RequestCategoryId.HasValue)
                AddCriteria(s => s.RequestCategoryId == request.Criterea.RequestCategoryId.Value);

            if (request.Criterea.LastStatus.HasValue)
                AddCriteria(s => s.LastStatus == request.Criterea.LastStatus.Value);

            if (request.Criterea.StartDate.HasValue)
                AddCriteria(s => s.Created.Date >= request.Criterea.StartDate.Value.Date);

            if (request.Criterea.EndDate.HasValue)
                AddCriteria(s => s.Created.Date <= request.Criterea.EndDate.Value.Date);
        }
    }
}