using System;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class IncentiveCriterea
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public double MinGoal { get; set; }
        public double MaxGoal { get; set; }
        public double MinAchievement { get; set; }
        public double MaxAchievement { get; set; }
        public Guid? RetailerId { get; set; }

    }
}