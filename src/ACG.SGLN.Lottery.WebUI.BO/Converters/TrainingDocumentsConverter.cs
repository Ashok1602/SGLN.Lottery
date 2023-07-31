using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.WebUI.Common.Converters;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.WebUI.BO.Converters
{
    public class TrainingDocumentsConverter : BaseConverter<TrainingDocument>
    {
        public override void WriteJson(JsonWriter writer, TrainingDocument value, JsonSerializer serializer)
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
                data = Convert.ToBase64String(value.Data),
                uri = value.Uri,
                spec = value.Spec,
                mimeType = value.MimeType,
                created = value.Created,
                comment = value.Comment
            }));
        }
    }
}
