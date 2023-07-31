using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using System;

namespace ACG.SGLN.Lottery.Application.RequestComments
{
    public class RequestCommentDto : IMapFrom<RequestComment>, IMapTo<RequestComment>
    {
        public string Body { get; set; }
        public Guid RequestId { get; set; }
    }
}