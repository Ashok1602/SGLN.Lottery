using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Notifications.Queries.GetNotificationById
{
    public class GetNotificationByIdQuery : IRequest<Notification>
    {
        public Guid Id { get; set; }
    }

    public class GetNotificationByIdQueryHandler : IRequestHandler<GetNotificationByIdQuery, Notification>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;

        public GetNotificationByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Notification> Handle(GetNotificationByIdQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Set<Notification>()
                .Where(r => r.Id == request.Id)
                .Include(r => r.RetailerNotifications).ThenInclude(rn => rn.Retailer)
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Notification), request.Id);

            return entity;
        }
    }
}