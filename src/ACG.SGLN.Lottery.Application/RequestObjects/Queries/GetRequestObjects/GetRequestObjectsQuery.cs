using ACG.SGLN.Lottery.Application.Common.Extensions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Queries;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetRequestObjects
{
    public class GetRequestObjectsQuery : GetAllQuery<RequestObject, Guid>
    {
        public RequestObjectCriterea Criterea { get; set; } = new RequestObjectCriterea();
        public bool? IsPublished { get; set; }
    }

    public class GetRequestsQueryHandler : GetAllQueryHandler<RequestObject, Guid>,
        IApplicationRequestHandler<GetRequestObjectsQuery, PagedResult<RequestObject>>
    {
        private readonly IApplicationDbContext _context;

        public GetRequestsQueryHandler(IApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<PagedResult<RequestObject>> Handle(GetAllQuery<RequestObject, Guid> request,
            CancellationToken cancellationToken)
        {
            var RequestQuery = _context.ApplySpecification
                (new RequestObjectsSearchSpecification((GetRequestObjectsQuery)request));

            return await RequestQuery
                .OrderByDescending(t => t.Created)
                .GetPaged(request.Page.GetValueOrDefault(1),
                    request.Size.GetValueOrDefault(CoreConstants.DefaultPageSize));
        }


    }
}