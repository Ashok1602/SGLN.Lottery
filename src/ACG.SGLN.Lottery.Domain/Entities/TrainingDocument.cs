using System;
namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class TrainingDocument : AbstractDocument
    {
        public Training Training { get; set; }
        public Guid TrainingId { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
    }
}
