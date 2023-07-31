using System;

namespace ACG.SGLN.Lottery.Application.TrainingModules
{
    public class TrainingModuleDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public int CountTrainings { get; set; }
        public DateTime Created { get; set; }
    }
}