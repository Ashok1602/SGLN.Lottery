using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class RequestCriterea : RetailerCriterea
    {
        public string RequestObject { get; set; }
        public Guid? RequestCategoryId { get; set; }
        public RequestNatureType? RequestNature { get; set; }
        public ProcessingDirectionType? ProcessingDirection { get; set; }
        public RequestStatusType? LastStatus { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Retailer { get; set; } = null; //Used to apply restriction so retailer only sees his requests
        public List<RequestAffectationType?> RequestAssignedTo { get; set; }

    }
}