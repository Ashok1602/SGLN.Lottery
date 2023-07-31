using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class Request : BaseEntity<Guid>, IHasDocuments<RequestDocument>, IHasComments<RequestComment>
    {
        public string Reference { get; set; }
        public string Description { get; set; }
        public string RequestObject { get; set; }
        public Guid RequestCategoryId { get; set; }
        public RequestCategory RequestCategory { get; set; }
        public RequestNatureType RequestNature { get; set; }
        public ProcessingDirectionType? ProcessingDirection { get; set; }
        public RequestStatusType LastStatus { get; set; }
        public RequestAffectationType RequestAssignedTo { get; set; }
        public string ClosingRetailerMessage { get; set; }
        public string ClosingDescriptionMessage { get; set; }
        public Retailer Retailer { get; set; }
        public Guid RetailerId { get; set; }
        public List<RequestDocument> Documents { get; set; }
        public List<RequestComment> Comments { get; set; }
        public List<RequestStatus> Statuses { get; set; }
    }
}
