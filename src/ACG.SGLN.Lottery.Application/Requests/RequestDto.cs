using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Application.Requests
{
    public class RequestDto : IMapFrom<Request>, IMapTo<Request>
    {
        public string Description { get; set; }
        public Guid RequestObjectId { get; set; }
        public Guid RequestCategoryId { get; set; }
        public RequestNatureType RequestNature { get; set; }

    }
}