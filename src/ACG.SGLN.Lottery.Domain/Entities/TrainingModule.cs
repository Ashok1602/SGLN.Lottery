using ACG.SGLN.Lottery.Domain.Common;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class TrainingModule : BaseEntity<Guid>
    {
        public string Title { get; set; }

        public List<Training> Trainings { get; set; }

    }
}
