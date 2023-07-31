namespace ACG.SGLN.Lottery.Domain.Options
{
    public class SecurityOptions
    {
        public string AuthorityUrl { get; set; }
        public string Scope { get; set; }
        public string JwtSecret { get; set; }
    }
}