using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetRequestObjects;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.RequestObjects.Queries
{
    public class RequestCategoriesSearchSpecification : BaseSpecification<RequestCategory>
    {
        public RequestCategoriesSearchSpecification(GetRequestCategoriesQuery request)
        {
            if (!string.IsNullOrEmpty(request.Criterea.Title))
                AddCriteria(s => s.Title.Contains(request.Criterea.Title));

            if (request.Criterea.RequestNature.HasValue)
                AddCriteria(s => s.RequestNature == request.Criterea.RequestNature.Value);

            if (request.IsPublished.HasValue)
                AddCriteria(s => s.IsDeactivated == false);
        }
    }
}