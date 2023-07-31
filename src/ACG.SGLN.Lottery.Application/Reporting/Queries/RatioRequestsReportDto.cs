namespace ACG.SGLN.Lottery.Application.Reporting.Queries
{
    public class RatioRequestsReportDto
    {
        public string Retailer { get; set; }
        public double RatioByNature { get; set; } = 0;
        public double RatioByCaytegory { get; set; } = 0;
        public double RatioByObject { get; set; } = 0;
        public double RatioByRetailer { get; set; } = 0;
        public double Percentage { get; set; } = 0;

    }
}
