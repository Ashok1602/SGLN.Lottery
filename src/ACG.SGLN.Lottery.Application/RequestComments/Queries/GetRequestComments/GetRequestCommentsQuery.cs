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

namespace ACG.SGLN.Lottery.Application.RequestComments.Queries.GetRequestComments
{
    public class GetRequestCommentsQuery : GetAllQuery<RequestComment, Guid>
    {
        public Guid RequestId { get; set; }
        public RequestCommentCriterea Criterea { get; set; } = new RequestCommentCriterea();
    }

    public class GetRequestCommentsQueryHandler : GetAllQueryHandler<RequestComment, Guid>,
        IApplicationRequestHandler<GetRequestCommentsQuery, PagedResult<RequestComment>>
    {
        private readonly IApplicationDbContext _context;

        public GetRequestCommentsQueryHandler(IApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<PagedResult<RequestComment>> Handle(GetAllQuery<RequestComment, Guid> request,
            CancellationToken cancellationToken)
        {
            var RequestCommentQuery = _context.ApplySpecification
                (new RequestCommentsSearchSpecification((GetRequestCommentsQuery)request));

            return await RequestCommentQuery
                .OrderByDescending(t => t.Created)
                .GetPaged(request.Page.GetValueOrDefault(1),
                    request.Size.GetValueOrDefault(CoreConstants.DefaultPageSize));
        }
    }
}