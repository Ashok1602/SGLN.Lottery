using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Announcements.Queries.GetAnnouncementById
{
    public class GetAnnouncementByIdQuery : IRequest<Announcement>
    {
        public Guid Id { get; set; }
    }

    public class GetAnnouncementByIdQueryHandler : IRequestHandler<GetAnnouncementByIdQuery, Announcement>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;

        public GetAnnouncementByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Announcement> Handle(GetAnnouncementByIdQuery req,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Set<Announcement>().FindAsync(req.Id);

            if (entity == null)
                throw new NotFoundException(nameof(Announcement), req.Id);

            return entity;
        }
    }
}