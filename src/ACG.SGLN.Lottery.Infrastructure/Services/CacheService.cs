using ACG.SGLN.Lottery.Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text;

namespace ACG.SGLN.Lottery.Infrastructure.Services
{
    public class CacheService : ICacheService
    {
        private readonly IDistributedCache _distributedCache;
        public CacheService(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }
        public T Get<T>(string key) where T : class
        {
            byte[] value = _distributedCache.Get(key);
            if (value != null)
            {
                try
                {
                    return JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(value));
                }
                catch { }
            }
            throw new KeyNotFoundException(key);
        }

        public void Refresh(string key)
        {
            try
            {
                _distributedCache.Refresh(key);
            }
            catch { }
        }

        public void Remove(string key)
        {
            try
            {
                _distributedCache.Remove(key);
            }
            catch { }
        }

        public void Set(string key, object value)
        {
            try
            {
                _distributedCache.Set(key, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(value)));
            }
            catch { }
        }
    }
}
