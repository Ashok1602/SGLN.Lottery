using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class RequestComment : AbstractComment
    {
        public Request Request { get; set; }
        public Guid RequestId { get; set; }
    }
}
