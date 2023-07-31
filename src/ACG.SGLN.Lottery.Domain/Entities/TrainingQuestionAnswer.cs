using ACG.SGLN.Lottery.Domain.Common;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class TrainingQuestionAnswer : BaseEntity<Guid>
    {
        public TrainingQuestion TrainingQuestion { get; set; }
        public Guid TrainingQuestionId { get; set; }
        public TrainingQuestionOption TrainingQuestionOption { get; set; }
        public Guid TrainingQuestionOptionId { get; set; } //Answer
    }
}
