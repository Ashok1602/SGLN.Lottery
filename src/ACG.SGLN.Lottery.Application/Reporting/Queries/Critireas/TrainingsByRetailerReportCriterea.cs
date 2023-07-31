using System;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class TrainingsByRetailerReportCriterea
    {
        public Guid? RetailerId { get; set; }
        public string InternalRetailerCode { get; set; }
    }
}