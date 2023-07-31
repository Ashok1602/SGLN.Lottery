using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Application.Trainings
{
    public class InteractiveTrainingDocumentVm
    {
        public string TrainingTitle { get; set; }
        public string ModuleName { get; set; }
        public List<InteractiveTrainingCourseSlideVm> ListTrainingCourseSlide { get; set; }
    }
}