using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Application.Notifications
{
    public class NotificationDto : IMapFrom<Notification>, IMapTo<Notification>
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public NotificationType Type { get; set; } = NotificationType.Notification;
        public List<Guid> TargetRetailerIds { get; set; } = new List<Guid>();
        public NotificationTargetType? TargetScreen { get; set; } = null;
        public Guid? TargetId { get; set; } = null;

    }
}