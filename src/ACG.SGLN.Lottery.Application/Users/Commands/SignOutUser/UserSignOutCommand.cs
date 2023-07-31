using ACG.SGLN.Lottery.Application.Common.Authorizations;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Commands.UpdateUser
{
    [AnonymousAccess]
    public class UserSignOutCommand : IRequest<Unit>
    {
        public string DeviceToken { get; set; }
    }

    public class UserSignOutCommandHandler : IRequestHandler<UserSignOutCommand, Unit>,
        IApplicationRequestHandler<UserSignOutCommand, Unit>
    {
        private readonly IIdentityService _identityService;

        public UserSignOutCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<Unit> Handle(UserSignOutCommand request,
            CancellationToken cancellationToken)
        {

            await _identityService.SignUserOut(request.DeviceToken);

            return Unit.Value;
        }
    }
}