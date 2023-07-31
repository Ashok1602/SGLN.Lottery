using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Application.Trainings
{
    public class InteractiveTrainingCourseSlideVm
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public Guid Id { get; set; }
        public DocumentType Type { get; set; }
    }
}