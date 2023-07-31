using ACG.SGLN.Lottery.Application.Common.Authorizations;
using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Commands.UpdateUser
{
    [AnonymousAccess]
    public class UserSignInCommand : IRequest<AuthenticationResult>
    {
        public UserSignInDto Data { get; set; }
    }

    public class UserSignInCommandHandler : IRequestHandler<UserSignInCommand, AuthenticationResult>,
        IApplicationRequestHandler<UserSignInCommand, AuthenticationResult>
    {
        private readonly IIdentityService _identityService;

        public UserSignInCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<AuthenticationResult> Handle(UserSignInCommand request,
            CancellationToken cancellationToken)
        {
            AuthenticationResult res = await _identityService.SignUserIn(request.Data.UserName, request.Data.Password, request.Data.DeviceToken);

            if (!res.Succeeded && !res.IsLockedOut)
                throw new InvalidOperationException(res.Errors[0]);

            return res;
        }
    }
}