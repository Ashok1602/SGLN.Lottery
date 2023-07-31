using System.Collections.Generic;

namespace ACG.SGLN.Lottery.WebUI.BO.Models
{
    public class CourseQuestionsDto
    {
        public List<string> Options { get; set; }
        public int CorrectOptionIndex { get; set; }
        public string Label { get; set; }
    }
}
