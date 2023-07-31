using ACG.SGLN.Lottery.Domain.Common;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class TrainingQuestionOption : BaseEntity<Guid>
    {
        public string Label { get; set; }
        public bool IsCorrect { get; set; } = false;
        public Guid TrainingQuestionId { get; set; }
        public TrainingQuestion TrainingQuestion { get; set; }
    }
}
