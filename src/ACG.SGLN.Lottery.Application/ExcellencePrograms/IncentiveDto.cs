using ACG.SGLN.Lottery.Domain.Enums;

namespace ACG.SGLN.Lottery.Application.ExcellencePrograms
{
    public class IncentiveDto
    {
        public GameType Type { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public double Goal { get; set; }
        public double Achievement { get; set; }
        public double AchievementRate { get; set; }
        public double Remains { get; set; }
        public double Bonus { get; set; }
    }
}