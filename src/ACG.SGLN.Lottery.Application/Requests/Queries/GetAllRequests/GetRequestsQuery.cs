using ACG.SGLN.Lottery.Application.Common.Extensions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Queries;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Requests.Queries.GetRequests
{
    public class GetRequestsQuery : GetAllQuery<Request, Guid>
    {
        public RequestCriterea Criterea { get; set; } = new RequestCriterea();
        public bool IsFromBo { get; set; }
    }

    public class GetRequestsQueryHandler : GetAllQueryHandler<Request, Guid>,
        IApplicationRequestHandler<GetRequestsQuery, PagedResult<Request>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetRequestsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService) : base(context)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public override async Task<PagedResult<Request>> Handle(GetAllQuery<Request, Guid> request,
            CancellationToken cancellationToken)
        {
            var parsedReq = (GetRequestsQuery)request;
            var RequestQuery = _context.ApplySpecification
                (new RequestsSearchSpecification(ApplyStatus(parsedReq)));

            return await RequestQuery
                .OrderByDescending(t => t.Created)
                .Select(r => parsedReq.IsFromBo ? new Request
                {
                    RequestNature = r.RequestNature,
                    RequestCategory = new RequestCategory
                    {
                        Id = r.RequestCategory.Id,
                        Title = r.RequestCategory.Title,
                        RequestNature = r.RequestNature
                    },
                    LastStatus = r.LastStatus,
                    Created = r.Created,
                    RequestObject = r.RequestObject,
                    Reference = r.Reference,
                    Id = r.Id,
                } : r)
                .GetPaged(request.Page.GetValueOrDefault(1),
                    request.Size.GetValueOrDefault(CoreConstants.DefaultPageSize));
        }

        private GetRequestsQuery ApplyStatus(GetRequestsQuery request)
        {
            if (_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Retailers))
                request.Criterea.Retailer = _currentUserService.UserId;
            else if (_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.ExternalAgent))
            {
                request.Criterea.RequestAssignedTo = new List<RequestAffectationType?>();
                request.Criterea.RequestAssignedTo.Add(RequestAffectationType.ExternalAgent);
            }
            else if (_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.InternalAgent))
            {
                request.Criterea.RequestAssignedTo = new List<RequestAffectationType?>();
                request.Criterea.RequestAssignedTo.Add(RequestAffectationType.InternalAgent);
                request.Criterea.RequestAssignedTo.Add(RequestAffectationType.ExternalAgent);
                if (_currentUserService.Administration != null)
                    request.Criterea.ProcessingDirection = _currentUserService.Administration;
            }
            return request;
        }
    }
}