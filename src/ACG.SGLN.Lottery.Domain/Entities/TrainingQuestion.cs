using ACG.SGLN.Lottery.Domain.Common;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class TrainingQuestion : BaseEntity<Guid>
    {
        public string Label { get; set; }
        public Training Training { get; set; }
        public Guid TrainingId { get; set; }
        public List<TrainingQuestionOption> Options { get; set; }
    }
}
