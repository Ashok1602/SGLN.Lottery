namespace ACG.SGLN.Lottery.Application.Reporting.Queries
{
    public class ProcessingTimeRequestsReportDto
    {
        public string Retailer { get; set; }
        public int ProcessingDaysByNature { get; set; }
        public int ProcessingHoursByNature { get; set; }
        public int ProcessingDaysByCaytegory { get; set; }
        public int ProcessingHoursByCaytegory { get; set; }
        public int ProcessingDaysByObject { get; set; }
        public int ProcessingHoursByObject { get; set; }
        public int ProcessingDaysByRetailer { get; set; }
        public int ProcessingHoursByRetailer { get; set; }

    }
}
