using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetRequestObjects;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.RequestObjects.Queries
{
    public class RequestObjectsSearchSpecification : BaseSpecification<RequestObject>
    {
        public RequestObjectsSearchSpecification(GetRequestObjectsQuery request)
        {
            AddInclude(s => s.RequestCategory);
            if (!string.IsNullOrEmpty(request.Criterea.Title))
                AddCriteria(s => s.Title.Contains(request.Criterea.Title));
            if (request.Criterea.RequestCategoryId != null)
                AddCriteria(s => s.RequestCategoryId == request.Criterea.RequestCategoryId);

            if (request.Criterea.RequestNature.HasValue)
                AddCriteria(s => s.RequestCategory.RequestNature == request.Criterea.RequestNature.Value);

            if (request.IsPublished.HasValue)
                AddCriteria(s => s.IsDeactivated == false);
        }
    }
}