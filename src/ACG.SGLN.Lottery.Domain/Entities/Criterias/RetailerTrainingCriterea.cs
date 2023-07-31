using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class RetailerTrainingCriterea
    {
        public DateTime? MinStartDate { get; set; }
        public DateTime? MaxStartDate { get; set; }
        public DateTime? MaxEndDate { get; set; }
        public DateTime? MinEndDate { get; set; }
        public TrainingType? TrainingType { get; set; }
        public string Filter { get; set; }
        public Guid? ModuleId { get; set; }
    }
}