using Newtonsoft.Json;
using System;

namespace ACG.SGLN.Lottery.WebUI.Common.Converters
{
    public abstract class BaseConverter<T> : JsonConverter<T>
    {
        public sealed override T ReadJson(JsonReader reader, Type objectType, T existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }
}
