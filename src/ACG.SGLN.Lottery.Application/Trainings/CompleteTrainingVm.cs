using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Application.Trainings
{
    public class CompleteTrainingVm
    {
        public Guid? Id { get; set; }
        public DocumentType? Type { get; set; }
        public string DocumentUri { get; set; }
        public string DocumentTitle { get; set; }
        public string DocumentMimeType { get; set; }
        public double ScoreRate { get; set; }
    }
}