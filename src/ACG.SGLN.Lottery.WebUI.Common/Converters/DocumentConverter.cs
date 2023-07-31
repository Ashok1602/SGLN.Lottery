using ACG.SGLN.Lottery.Domain.Entities;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.WebUI.Common.Converters
{
    public class DocumentConverter<TDocument> : BaseConverter<TDocument>
        where TDocument : AbstractDocument
    {
        public override void WriteJson(JsonWriter writer, TDocument value, JsonSerializer serializer)
        {
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                Converters = new List<JsonConverter>() { new StringEnumConverter() }
            };

            writer.WriteRawValue(JsonConvert.SerializeObject(new
            {
                id = value.Id,
                type = value.Type,
                fileName = value.Uri,
                uri = value.Uri,
                spec = value.Spec,
                mimeType = value.MimeType,
                created = value.Created,
                comment = value.Comment
            }));
        }
    }
}
