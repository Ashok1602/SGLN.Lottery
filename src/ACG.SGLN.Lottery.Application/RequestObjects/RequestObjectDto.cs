using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Application.RequestObjects
{
    public class RequestObjectDto : IMapFrom<RequestObject>, IMapTo<RequestObject>
    {
        public string Title { get; set; }
        public bool? IsExternal { get; set; }
        public Guid RequestCategoryId { get; set; }
        public byte[] Data { get; set; }
        public string MimeType { get; set; }
        public ProcessingDirectionType? ProcessingDirection { get; set; }

    }
}