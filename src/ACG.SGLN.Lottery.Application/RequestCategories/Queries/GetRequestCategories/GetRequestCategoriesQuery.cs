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
    public class GetRequestCategoriesQuery : GetAllQuery<RequestCategory, Guid>
    {
        public RequestCategoriesCriterea Criterea { get; set; } = new RequestCategoriesCriterea();
        public bool? IsPublished { get; set; }
    }

    public class GetRequestCategoriesQueryHandler : GetAllQueryHandler<RequestCategory, Guid>,
        IApplicationRequestHandler<GetRequestCategoriesQuery, PagedResult<RequestCategory>>
    {
        private readonly IApplicationDbContext _context;

        public GetRequestCategoriesQueryHandler(IApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<PagedResult<RequestCategory>> Handle(GetAllQuery<RequestCategory, Guid> request,
            CancellationToken cancellationToken)
        {
            var RequestQuery = _context.ApplySpecification
                (new RequestCategoriesSearchSpecification((GetRequestCategoriesQuery)request));

            return await RequestQuery
                .OrderByDescending(t => t.Created)
                .GetPaged(request.Page.GetValueOrDefault(1),
                    request.Size.GetValueOrDefault(CoreConstants.DefaultPageSize));
        }


    }
}