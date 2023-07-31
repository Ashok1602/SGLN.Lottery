using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class RatioRequestsReportCriterea
    {
        public Guid? RetailerId { get; set; }
        public RequestNatureType? Nature { get; set; }
        public Guid? RequestCategoryId { get; set; }
        public Guid? RequestObjectId { get; set; }
        public RequestStatusType Status { get; set; }

    }
}