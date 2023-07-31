using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static ACG.SGLN.Lottery.Domain.Constants.ConfigurationConstants;

namespace ACG.SGLN.Lottery.Application.Retailers.Commands
{
    public class ToggleNotifcationCommand : IRequest<Unit>
    {
        public bool IsNotified { get; set; }
        public string DeviceToken { get; set; }
    }

    public class ToggleNotifcationCommandHandler : IRequestHandler<ToggleNotifcationCommand, Unit>,
        IApplicationRequestHandler<ToggleNotifcationCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly ICurrentUserService _currentUserService;
        private readonly IPushNotificationSender _pushNotificationSender;

        public ToggleNotifcationCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService, IPushNotificationSender pushNotificationSender)
        {
            _dbContext = dbContext;
            _currentUserService = currentUserService;
            _pushNotificationSender = pushNotificationSender;
        }

        public async Task<Unit> Handle(ToggleNotifcationCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<Retailer>()
                    .Where(r => r.UserId == _currentUserService.UserId)
                    .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Retailer), _currentUserService.UserId);

            entity.IsNotified = request.IsNotified;
            if (request.IsNotified)
                await _pushNotificationSender.SubscribeToTopicAsync(request.DeviceToken, Topics.Notified);
            else
                await _pushNotificationSender.UnSubscribeFromTopicAsync(request.DeviceToken, Topics.Notified);

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
