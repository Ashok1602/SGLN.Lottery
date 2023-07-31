namespace ACG.SGLN.Lottery.Domain.Options
{
    public class FTPOptions
    {
        public string Host { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string IncentivesPath { get; set; }
        public string InvoicesPath { get; set; }
        public string BasePath { get; set; }
    }
}