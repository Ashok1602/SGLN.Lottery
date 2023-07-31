using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.Notifications.Queries.GetNotifications;
using ACG.SGLN.Lottery.Domain.Entities;
using System.Linq;

namespace ACG.SGLN.Lottery.Application.Notifications.Queries
{
    public class NotificationsSearchSpecification : BaseSpecification<Notification>
    {
        public NotificationsSearchSpecification(GetNotificationsQuery request)
        {
            AddInclude(notif => notif.RetailerNotifications);

            if (request.Criterea.Type.HasValue)
                AddCriteria(s => s.Type == request.Criterea.Type.Value);

            if (!string.IsNullOrEmpty(request.Criterea.Title))
                AddCriteria(s => s.Title.Contains(request.Criterea.Title));

            if (!string.IsNullOrEmpty(request.Criterea.Body))
                AddCriteria(s => s.Body.Contains(request.Criterea.Body));

            if (request.Criterea.StartDate.HasValue)
                AddCriteria(s => s.Created.Date >= request.Criterea.StartDate.Value.Date);

            if (request.Criterea.EndDate.HasValue)
                AddCriteria(s => s.Created.Date <= request.Criterea.EndDate.Value.Date);

            if (request.Criterea.TargetRetailerId.HasValue)
                AddCriteria(s => s.TargetId == request.Criterea.TargetRetailerId.Value
                || s.RetailerNotifications.Any(t => t.RetailerId == request.Criterea.TargetRetailerId));
        }

    }
}