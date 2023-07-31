namespace ACG.SGLN.Lottery.Application.ExcellencePrograms
{
    public class IncentiveInputDto
    {
        public string InternalRetailerCode { get; set; }
        public string GameCode { get; set; }
        public string GameName { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public double Goal { get; set; }
        public double Achievement { get; set; }
        public double Bonus { get; set; }
    }
}