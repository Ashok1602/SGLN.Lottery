using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.WebUI.BO.Models;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Application.Trainings
{
    public class InteractiveTrainingDto : IMapFrom<Training>, IMapTo<Training>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid ModuleId { get; set; }
        public List<CourseSlideContentDto> CourseSlides { get; set; }
        public List<CourseQuestionsDto> CourseQuestions { get; set; }
    }
}