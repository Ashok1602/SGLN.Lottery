using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;

namespace ACG.SGLN.Lottery.Application.RequestCategorys
{
    public class RequestCategoryDto : IMapFrom<RequestCategory>, IMapTo<RequestCategory>
    {
        public RequestNatureType RequestNature { get; set; }
        public string Title { get; set; }
        public byte[] Data { get; set; }
        public string MimeType { get; set; }
    }
}