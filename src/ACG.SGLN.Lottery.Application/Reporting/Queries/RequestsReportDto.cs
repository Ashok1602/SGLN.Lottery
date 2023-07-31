namespace ACG.SGLN.Lottery.Application.Reporting.Queries
{
    public class RequestsReportDto
    {
        public string Retailer { get; set; }
        public int CountByNature { get; set; } = 0;
        public int CountByCaytegory { get; set; } = 0;
        public int CountByObject { get; set; } = 0;
        public int CountByRetailer { get; set; } = 0;

    }
}
