namespace ACG.SGLN.Lottery.Application.Reporting.Queries
{
    public class RetailersReportDto
    {
        public int CountActiveRetailers { get; set; }
        public int CountRegisteredRetailers { get; set; }
        public double RatioActiveRegistered { get; set; }
    }
}