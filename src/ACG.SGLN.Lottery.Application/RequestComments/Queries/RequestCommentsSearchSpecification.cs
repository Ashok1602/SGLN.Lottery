using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.RequestComments.Queries.GetRequestComments;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.RequestComments.Queries
{
    public class RequestCommentsSearchSpecification : BaseSpecification<RequestComment>
    {
        public RequestCommentsSearchSpecification(GetRequestCommentsQuery request)
        {
            if (!string.IsNullOrEmpty(request.Criterea.Body))
                AddCriteria(s => s.Body.Contains(request.Criterea.Body));
        }
    }
}