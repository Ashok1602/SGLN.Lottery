using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class RetailerTraining : BaseEntity<Guid>
    {
        public Retailer Retailer { get; set; }
        public Guid RetailerId { get; set; }

        public Training Training { get; set; }
        public Guid TrainingId { get; set; }

        public TrainingStatusType LastStatus { get; set; }

        public double? Score { get; set; }

        public double? ScoreRate { get; set; } //can be calculated, but for reporting performance sake better to precalculate it

        public List<RetailerTrainingStatus> Statuses { get; set; }
    }
}
