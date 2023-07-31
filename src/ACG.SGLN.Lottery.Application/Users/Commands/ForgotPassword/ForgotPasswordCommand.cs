using ACG.SGLN.Lottery.Application.Common.Authorizations;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Commands.ForgotPassword
{
    [AnonymousAccess]
    public class ForgotPasswordCommand : IRequest<Unit>
    {
        public string RecoverInput { get; set; }
        public RecoverType Type { get; set; } = RecoverType.Email;
    }

    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, Unit>,
        IApplicationRequestHandler<ForgotPasswordCommand, Unit>
    {
        private readonly IIdentityService _identityService;

        public ForgotPasswordCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            return await _identityService.ForgotPassworAsync(request.RecoverInput, request.Type);
        }
    }
}