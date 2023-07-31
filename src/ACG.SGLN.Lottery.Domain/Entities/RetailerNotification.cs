using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class RetailerNotification
    {
        public Retailer Retailer { get; set; }
        public Guid RetailerId { get; set; }
        public Notification Notification { get; set; }
        public Guid NotificationId { get; set; }
    }
}
