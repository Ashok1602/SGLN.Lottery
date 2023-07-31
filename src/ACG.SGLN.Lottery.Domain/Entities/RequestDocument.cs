using System;
namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class RequestDocument : AbstractDocument
    {
        public Request Request { get; set; }
        public Guid RequestId { get; set; }
    }
}
