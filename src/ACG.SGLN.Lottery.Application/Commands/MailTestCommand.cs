using ACG.SGLN.Lottery.Application.Common.Authorizations;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Notifications;
using ACG.SGLN.Lottery.Domain.Constants;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Commands
{
    [AnonymousAccess]
    public class MailTestCommand : IRequest<Unit>
    {
        public List<string> Emails { get; set; }
    }

    public class MailTestCommandHandler : IRequestHandler<MailTestCommand, Unit>,
        IApplicationRequestHandler<MailTestCommand, Unit>
    {
        private readonly IEmailSender _emailSender;

        public MailTestCommandHandler(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public async Task<Unit> Handle(MailTestCommand request, CancellationToken cancellationToken)
        {
            MailNotificationDto dto = new MailNotificationDto { Body = "This is a test email, health check for mailing" };

            if (request.Emails.Any())
                await _emailSender.SendEmailNotificationAsync<MailNotificationDto>(request.Emails, "Test Mail", TemplatesNames.Emails.MailNotification, dto);

            return Unit.Value;
        }
    }
}
