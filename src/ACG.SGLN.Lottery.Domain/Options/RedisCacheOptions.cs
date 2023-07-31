namespace ACG.SGLN.Lottery.Domain.Options
{
    public class RedisCacheOptions
    {
        public string Key { get; set; }

        public string Host { get; set; }

        public int Port { get; set; }
    }
}