using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Notifications;
using ACG.SGLN.Lottery.Application.Notifications.Commands.CreateNotification;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using InvalidOperationException = ACG.SGLN.Lottery.Application.Common.Exceptions.InvalidOperationException;


namespace ACG.SGLN.Lottery.Application.Requests.Commands.CloseRequest
{
    public class CloseRequestCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
        public CloseRequestDto ClosingDetail { get; set; }
    }

    public class CloseRequestCommandHandler : IRequestHandler<CloseRequestCommand, Unit>,
        IApplicationRequestHandler<CloseRequestCommand, Unit>
    {
        private readonly IApplicationDbContext _dbcontext;
        private readonly IPushNotificationSender _pushNotificationSender;
        private readonly ICurrentUserService _currentUserService;
        private readonly IIdentityService _identityService;
        private readonly IMediator _mediator;
        private readonly IEmailSender _emailSender;

        public CloseRequestCommandHandler(IApplicationDbContext dbcontext, IPushNotificationSender pushNotificationSender,
        IIdentityService identityService, IMediator mediator, ICurrentUserService currentUserService, IEmailSender emailSender)
        {
            _emailSender = emailSender;
            _mediator = mediator;
            _identityService = identityService;
            _pushNotificationSender = pushNotificationSender;
            _dbcontext = dbcontext;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(CloseRequestCommand request,
            CancellationToken CloselationToken)
        {
            var entity = await _dbcontext.Set<Request>().Include(d => d.Retailer).Where(d => d.Id == request.Id).FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Request), request.Id);

            if (_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Administrators)
            || (_currentUserService.Administration != null && _currentUserService.Administration != entity.ProcessingDirection))
                throw new InvalidOperationException("Vous n'êtes pas autorisé à faire cette action");

            if (entity.LastStatus == RequestStatusType.Closed)
                throw new InvalidOperationException();

            entity.LastStatus = RequestStatusType.Closed;
            entity.ClosingRetailerMessage = request.ClosingDetail.ClosingRetailerMessage;
            entity.ClosingDescriptionMessage = request.ClosingDetail.ClosingDescriptionMessage;
            _dbcontext.Set<RequestStatus>().Add(new RequestStatus
            {
                RequestId = entity.Id,
                StatusType = RequestStatusType.Closed,
                Comment = request.ClosingDetail.ClosingRetailerMessage
            });

            _dbcontext.Entry(entity).State = EntityState.Modified;

            await _dbcontext.SaveChangesAsync(CloselationToken);

            List<Guid> retailerIds = new List<Guid>();
            retailerIds.Add(entity.RetailerId);
            try
            {
                NotificationDto notificationDto = new NotificationDto()
                {
                    Title = "Demande clôturée",
                    Body = $"La demande numéro { entity.Reference } du détaillant numéro { entity.Retailer.InternalRetailerCode },ayant comme objet { entity.RequestObject.Split('|')[1] },soumise le { entity.Created.ToShortDateString() }  est clôturée.",
                    TargetScreen = NotificationTargetType.RequestListScreen,
                    TargetId = entity.Id,
                    TargetRetailerIds = retailerIds
                };
                await _mediator.Send(new CreateNotificationCommand { Data = notificationDto });
                MailNotificationDto dto = new MailNotificationDto { Body = notificationDto.Body };
                List<string> emails = new List<string>();
                if (!string.IsNullOrEmpty(entity.Retailer.SGLNCommercialMail))
                    emails.Add(entity.Retailer.SGLNCommercialMail);
                if (!string.IsNullOrEmpty(entity.Retailer.SISALCommercialMail))
                    emails.Add(entity.Retailer.SISALCommercialMail);
                if (emails.Any())
                    await _emailSender.SendEmailNotificationAsync<MailNotificationDto>(emails, notificationDto.Title, TemplatesNames.Emails.MailNotification, dto);
            }
            catch { }

            return Unit.Value;
        }
    }
}