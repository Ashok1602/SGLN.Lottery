using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Notifications.Commands.DeleteNotification
{
    public class DeleteNotificationCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeleteNotificationCommandHandler : IRequestHandler<DeleteNotificationCommand, Unit>,
        IApplicationRequestHandler<DeleteNotificationCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;

        public DeleteNotificationCommandHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(DeleteNotificationCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<Notification>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(Notification), request.Id);

            entity.IsDeleted = true;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
