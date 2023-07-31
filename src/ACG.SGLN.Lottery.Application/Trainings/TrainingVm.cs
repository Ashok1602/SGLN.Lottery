using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Application.Trainings
{
    public class TrainingVm
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CourseURI { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public TrainingType Type { get; set; }
        public TrainingStatusType? LastStatus { get; set; }
        public double? Score { get; set; }
        public double? ScoreRate { get; set; }
        public DateTime Created { get; set; }
        public Guid? DocumentId { get; set; }
        public DocumentType? DocumentType { get; set; }
        public string DocumentUri { get; set; }
        public string DocumentTitle { get; set; }
        public string DocumentMimeType { get; set; }

    }
}