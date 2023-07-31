using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class Notification : BaseEntity<Guid>
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public NotificationType Type { get; set; }
        public NotificationTargetType? TargetScreen { get; set; } = null;
        public Guid? TargetId { get; set; } = null;
        public List<RetailerNotification> RetailerNotifications { get; set; }
    }
}
