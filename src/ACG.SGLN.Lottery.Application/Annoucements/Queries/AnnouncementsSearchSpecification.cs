using ACG.SGLN.Lottery.Application.Announcements.Queries.GetAnnouncements;
using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Announcements.Queries
{
    public class AnnouncementsSearchSpecification : BaseSpecification<Announcement>
    {
        public AnnouncementsSearchSpecification(GetAnnouncementsQuery request)
        {
            if (request.Criterea.IsPublished.HasValue)
                AddCriteria(s => s.IsPublished == request.Criterea.IsPublished.Value);

            if (!string.IsNullOrEmpty(request.Criterea.Title))
                AddCriteria(s => s.Title.Contains(request.Criterea.Title));

            if (request.Criterea.MaxCreationDate.HasValue)
                AddCriteria(s => s.Created.Date <= request.Criterea.MaxCreationDate.Value.Date);

            if (request.Criterea.MinCreationDate.HasValue)
                AddCriteria(s => s.Created.Date >= request.Criterea.MinCreationDate.Value.Date);
        }
    }
}