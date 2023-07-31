using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Notifications.Queries.GetStrippedNotifications
{
    public class GetStrippedNotificationsQuery : IRequest<List<IdValueDto<Guid>>>
    {
    }

    public class GetAllNotificationsQueryHandler : IRequestHandler<GetStrippedNotificationsQuery, List<IdValueDto<Guid>>>,
        IApplicationRequestHandler<GetStrippedNotificationsQuery, List<IdValueDto<Guid>>>
    {
        private readonly IApplicationDbContext _context;

        public GetAllNotificationsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<List<IdValueDto<Guid>>> Handle(GetStrippedNotificationsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Set<Notification>().AsQueryable();

            //if (_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Retailers))
            //{
            //    var curRetailer = _context.Retailers.Where(r => r.UserId == _currentUserService.UserId).FirstOrDefault();
            //    query = query.Where(r => r.TargetRetailers == curRetailer.Id);
            //}

            return await query.OrderBy(t => t.Title)
                .Select(e => new IdValueDto<Guid>
                {
                    Id = e.Id,
                    Value = e.Title
                })
                .ToListAsync();
        }
    }
}
