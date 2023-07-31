using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class RequestStatus : BaseEntity<Guid>
    {
        public Request Request { get; set; }
        public Guid RequestId { get; set; }
        public RequestStatusType StatusType { get; set; }
        public string Comment { get; set; }
    }
}
