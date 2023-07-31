using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class TrainingCriterea
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public TrainingType? TrainingType { get; set; }
        public string Filter { get; set; }
        public Guid? ModuleId { get; set; }
    }
}