using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Announcements.Commands
{
    public class DeleteAnnouncementCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeleteAnnouncementCommandHandler : IRequestHandler<DeleteAnnouncementCommand, Unit>,
        IApplicationRequestHandler<DeleteAnnouncementCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;

        public DeleteAnnouncementCommandHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(DeleteAnnouncementCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<Announcement>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(Announcement), request.Id);

            entity.IsDeleted = true;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
