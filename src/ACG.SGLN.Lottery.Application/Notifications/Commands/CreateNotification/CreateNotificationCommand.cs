using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Notifications.Commands.CreateNotification
{
    public class CreateNotificationCommand : IRequest<Notification>
    {
        public NotificationDto Data { get; set; }
    }

    public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, Notification>,
        IApplicationRequestHandler<CreateNotificationCommand, Notification>
    {
        private readonly IApplicationDbContext _dbcontext;
        private readonly IIdentityService _identityService;
        private readonly IPushNotificationSender _pushNotificationSender;
        private readonly IMapper _mapper;

        public CreateNotificationCommandHandler(IMapper mapper, IApplicationDbContext dbContext,
            IPushNotificationSender pushNotificationSender, IIdentityService identityService)
        {
            _mapper = mapper;
            _dbcontext = dbContext;
            _pushNotificationSender = pushNotificationSender;
            _identityService = identityService;
        }

        public async Task<Notification> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
        {

            var notification = _mapper.Map<Notification>(request.Data);
            if (request.Data.TargetRetailerIds.Count > 0)
            {
                List<Retailer> retailers = await _dbcontext.Retailers
                    .Where(r => request.Data.TargetRetailerIds.Contains(r.Id))
                    .ToListAsync();

                if (retailers == null)
                    throw new NotFoundException(nameof(Retailer), request.Data.TargetRetailerIds);

                List<string> tokens = await _identityService.GetUsersTokensAsync(retailers.Where(r => r.IsNotified || request.Data.Type == NotificationType.Alert)
                    .Select(r => r.UserId).ToList());
                await _pushNotificationSender.SendTargetedPushNotificationAsync(notification.Title, notification.Body, tokens);
                notification.RetailerNotifications = retailers.Select(r => new RetailerNotification
                {
                    RetailerId = r.Id
                }).ToList();
            }
            else
                await _pushNotificationSender.SendMulticastPushNotificationAsync(notification.Title, notification.Body, request.Data.Type);

            _dbcontext.Set<Notification>().Add(notification);

            await _dbcontext.SaveChangesAsync(cancellationToken);

            return notification;
        }
    }
}
