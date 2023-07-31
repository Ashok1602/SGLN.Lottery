﻿using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.WebUI.Common.Converters;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Converters
{
    public class AnnouncementConverter : BaseConverter<Announcement>
    {
        public override void WriteJson(JsonWriter writer, Announcement value, JsonSerializer serializer)
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
                created = value.Created,
                title = value.Title,
                body = value.Body,
                type = value.Type,
                isPublished = value.IsPublished
            }));
        }
    }
}
