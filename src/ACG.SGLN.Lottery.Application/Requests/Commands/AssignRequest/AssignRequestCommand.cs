using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Notifications;
using ACG.SGLN.Lottery.Application.Notifications.Commands.CreateNotification;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using InvalidOperationException = ACG.SGLN.Lottery.Application.Common.Exceptions.InvalidOperationException;

namespace ACG.SGLN.Lottery.Application.Requests.Commands.AssignRequest
{
    public class AssignRequestCommand : IRequest<Unit>
    {
        public Guid RequestId { get; set; }

        public bool IsExternal { get; set; }

        public ProcessingDirectionType? ProcessingDirection { get; set; }

    }

    public class AssignRequestCommandHandler : IRequestHandler<AssignRequestCommand, Unit>,
        IApplicationRequestHandler<AssignRequestCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;
        private readonly IPushNotificationSender _pushNotificationSender;
        private readonly IMediator _mediator;
        private readonly IEmailSender _emailSender;

        public AssignRequestCommandHandler(IApplicationDbContext dbContext, IIdentityService identityService, IMapper mapper,
        IPushNotificationSender pushNotificationSender, IMediator mediator, IEmailSender emailSender)
        {
            _emailSender = emailSender;
            _mediator = mediator;
            _pushNotificationSender = pushNotificationSender;
            _dbContext = dbContext;
            _identityService = identityService;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(AssignRequestCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<Request>().Include(d => d.Retailer).Where(d => d.Id == request.RequestId).FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Request), request.RequestId);

            if (entity.RequestAssignedTo != RequestAffectationType.None)
                throw new InvalidOperationException("La demande est dèja assignée");

            entity.RequestAssignedTo = request.IsExternal ? RequestAffectationType.ExternalAgent : RequestAffectationType.InternalAgent;

            if (request.ProcessingDirection != null)
                entity.ProcessingDirection = request.ProcessingDirection;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            List<Guid> retailerIds = new List<Guid>();
            retailerIds.Add(entity.RetailerId);
            try
            {
                NotificationDto notificationDto = new NotificationDto()
                {
                    Title = "Demande assignée",
                    Body = $"La demande numéro {entity.Reference} du détaillant numéro {entity.Retailer.InternalRetailerCode}, ayant comme objet {entity.RequestObject.Split('|')[1]}, soumise le {entity.Created.ToShortDateString()} est assignée à un agent pour traitement.",
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
