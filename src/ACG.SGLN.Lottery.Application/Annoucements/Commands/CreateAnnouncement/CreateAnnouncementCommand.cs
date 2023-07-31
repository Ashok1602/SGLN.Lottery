
using ACG.SGLN.Lottery.Application.Annoucements;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Announcements.Commands
{
    public class CreateAnnouncementCommand : IRequest<Unit>
    {
        public AnnouncementDto Data { get; set; }
    }

    public class CreateAnnouncementCommandHandler : IRequestHandler<CreateAnnouncementCommand, Unit>,
        IApplicationRequestHandler<CreateAnnouncementCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IStorage _storage;

        public CreateAnnouncementCommandHandler(IApplicationDbContext dbContext, IMapper mapper, IStorage storage)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _storage = storage;
        }

        public async Task<Unit> Handle(CreateAnnouncementCommand request, CancellationToken cancellationToken)
        {
            Announcement announcement = _mapper.Map<Announcement>(request.Data);
            announcement.Type = DocumentType.AnnouncementCoverPicture;

            _dbContext.Set<Announcement>().Add(announcement);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }

    }
}
