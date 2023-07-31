using System;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class AnnouncementCriterea
    {
        public DateTime? MinCreationDate { get; set; }
        public DateTime? MaxCreationDate { get; set; }
        public string Title { get; set; }
        public bool? IsPublished { get; set; }
    }
}