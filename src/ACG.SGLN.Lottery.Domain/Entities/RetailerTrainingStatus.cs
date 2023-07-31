using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class RetailerTrainingStatus : BaseEntity<Guid>
    {
        public RetailerTraining RetailerTraining { get; set; }
        public Guid RetailerTrainingId { get; set; }
        public TrainingStatusType StatusType { get; set; }
    }
}
