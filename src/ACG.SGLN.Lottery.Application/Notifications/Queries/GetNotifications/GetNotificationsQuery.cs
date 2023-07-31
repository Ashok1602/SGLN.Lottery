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

namespace ACG.SGLN.Lottery.Application.Notifications.Queries.GetNotifications
{
    public class GetNotificationsQuery : GetAllQuery<Notification, Guid>
    {
        public NotificationCriterea Criterea { get; set; } = new NotificationCriterea();
    }

    public class GetNotificationsQueryHandler : GetAllQueryHandler<Notification, Guid>,
        IApplicationRequestHandler<GetNotificationsQuery, PagedResult<Notification>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetNotificationsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService) : base(context)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public override async Task<PagedResult<Notification>> Handle(GetAllQuery<Notification, Guid> request,
            CancellationToken cancellationToken)
        {
            var NotificationQuery = _context.ApplySpecification
                (new NotificationsSearchSpecification(ApplyStatus(((GetNotificationsQuery)request))));

            if (!_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Retailers))
                NotificationQuery = NotificationQuery.Where(n => n.TargetId == null && n.TargetScreen == null);

            return await NotificationQuery
            .OrderByDescending(t => t.Created)
            .GetPaged(request.Page.GetValueOrDefault(1),
                request.Size.GetValueOrDefault(CoreConstants.DefaultPageSize));
        }

        private GetNotificationsQuery ApplyStatus(GetNotificationsQuery request)
        {
            if (_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Retailers))
            {
                var curRetailer = _context.Retailers.Where(r => r.UserId == _currentUserService.UserId).FirstOrDefault();
                request.Criterea.TargetRetailerId = curRetailer.Id;
            }

            return request;
        }
    }
}