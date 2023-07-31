namespace ACG.SGLN.Lottery.Application.Reporting.Queries
{
    public class IncentivesReportDto
    {
        public string CompanyIdentifier { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public double Goal { get; set; }
        public double Achievement { get; set; }
        public double AchievementRate { get; set; }
        public double Remains { get; set; }
        public double Bonus { get; set; }
    }
}
