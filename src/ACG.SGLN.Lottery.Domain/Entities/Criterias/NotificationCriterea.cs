using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class NotificationCriterea
    {
        public NotificationType? Type { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public Guid? TargetRetailerId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}