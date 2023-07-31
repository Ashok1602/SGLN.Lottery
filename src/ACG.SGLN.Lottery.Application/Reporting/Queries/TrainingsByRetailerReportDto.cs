
namespace ACG.SGLN.Lottery.Application.Reporting.Queries
{
    public class TrainingsByRetailerReportDto
    {
        public string Civility { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Phone { get; set; }
        public string Training { get; set; }
        public string Module { get; set; }
        public string TrainingDate { get; set; }
        public string TestDate { get; set; }
        public int? CompleteDelay { get; set; }
        public double? ScoreRate { get; set; }
    }
}
