using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Annoucements
{
    public class AnnouncementDto : IMapTo<Announcement>, IMapFrom<Announcement>
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public string Uri { get; set; }
        public byte[] Data { get; set; }
        public string MimeType { get; set; }
    }
}
