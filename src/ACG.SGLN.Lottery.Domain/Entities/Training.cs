using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class Training : BaseEntity<Guid>, IHasDocuments<TrainingDocument>
    {
        public TrainingModule Module { get; set; }
        public Guid? ModuleId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public TrainingType Type { get; set; }
        public string CourseURI { get; set; }
        public List<TrainingQuestion> Questions { get; set; }
        public List<TrainingDocument> Documents { get; set; }
        public List<RetailerTraining> RetailerTrainings { get; set; }
        public bool IsPublished { get; set; } = false;

    }
}
