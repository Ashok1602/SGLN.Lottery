namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface ICacheService
    {
        T Get<T>(string key) where T : class;
        void Refresh(string key);
        void Remove(string key);
        void Set(string key, object value);
    }
}
