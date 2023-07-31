using ACG.SGLN.Lottery.Application.Common.Extensions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Queries;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Announcements.Queries.GetAnnouncements
{
    public class GetAnnouncementsQuery : GetAllQuery<Announcement, Guid>
    {
        public AnnouncementCriterea Criterea { get; set; } = new AnnouncementCriterea();
    }

    public class GetAnnouncementsQueryHandler : GetAllQueryHandler<Announcement, Guid>,
        IApplicationRequestHandler<GetAnnouncementsQuery, PagedResult<Announcement>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetAnnouncementsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService) : base(context)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public override async Task<PagedResult<Announcement>> Handle(GetAllQuery<Announcement, Guid> Announcement,
            CancellationToken cancellationToken)
        {
            var AnnouncementQuery = _context.ApplySpecification
                (new AnnouncementsSearchSpecification((ApplyStatus((GetAnnouncementsQuery)Announcement))));

            return await AnnouncementQuery
                .OrderByDescending(t => t.Created)
                .GetPaged(Announcement.Page.GetValueOrDefault(1),
                    Announcement.Size.GetValueOrDefault(CoreConstants.DefaultPageSize));
        }

        private GetAnnouncementsQuery ApplyStatus(GetAnnouncementsQuery request)
        {
            if (_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Retailers))
                request.Criterea.IsPublished = true;

            return request;
        }
    }
}