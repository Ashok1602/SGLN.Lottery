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

namespace ACG.SGLN.Lottery.Application.Requests.Commands.StartRequest
{
    public class StartRequestCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class StartRequestCommandHandler : IRequestHandler<StartRequestCommand, Unit>,
        IApplicationRequestHandler<StartRequestCommand, Unit>
    {
        private readonly IApplicationDbContext _dbcontext;
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUserService;
        private readonly IEmailSender _emailSender;

        public StartRequestCommandHandler(IApplicationDbContext dbcontext, IMediator mediator, ICurrentUserService currentUserService, IEmailSender emailSender)
        {
            _emailSender = emailSender;
            _mediator = mediator;
            _dbcontext = dbcontext;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(StartRequestCommand request,
            CancellationToken ContestlationToken)
        {
            Request entity = await _dbcontext.Requests
                .Where(r => r.Id == request.Id)
                .Include(r => r.Retailer)
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Request), request.Id);

            if (_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Administrators)
            || (_currentUserService.Administration != null && _currentUserService.Administration != entity.ProcessingDirection))
                throw new InvalidOperationException("Vous n'êtes pas autorisé à faire cette action");

            if (((entity.LastStatus != RequestStatusType.Submitted && entity.LastStatus != RequestStatusType.Contested)
                || entity.RequestAssignedTo == RequestAffectationType.None
                )
                /*|| _currentUserService.Administration.HasValue && entity.DirectionInCharge != _currentUserService.Administration.Value */// Other administrations cannot start the process
                )
                throw new InvalidOperationException();

            entity.LastStatus = RequestStatusType.InProgress;
            _dbcontext.Set<RequestStatus>().Add(new RequestStatus
            {
                StatusType = entity.LastStatus,
                RequestId = entity.Id
            });

            _dbcontext.Entry(entity).State = EntityState.Modified;

            List<Guid> retailerIds = new List<Guid>();
            retailerIds.Add(entity.RetailerId);
            try
            {
                NotificationDto notificationDto = new NotificationDto()
                {
                    Title = "Demande en cours de traitement",
                    Body = $"La demande numéro {entity.Reference} du détaillant numéro {entity.Retailer.InternalRetailerCode}, ayant comme objet {entity.RequestObject.Split('|')[1]}, soumise le {entity.Created.ToShortDateString()} est en cours de traitement.",
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


            await _dbcontext.SaveChangesAsync(ContestlationToken);

            return Unit.Value;
        }
    }
}