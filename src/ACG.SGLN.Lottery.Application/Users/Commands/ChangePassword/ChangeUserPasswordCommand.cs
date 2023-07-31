using ACG.SGLN.Lottery.Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Commands.DeleteUser
{
    public class ChangeUserPasswordCommand : IRequest<Unit>
    {
        public ChangePasswordData ChangePasswordData { get; set; }
    }

    public class ChangeUserPasswordCommandHandler : IRequestHandler<ChangeUserPasswordCommand, Unit>,
        IApplicationRequestHandler<ChangeUserPasswordCommand, Unit>
    {
        private readonly IIdentityService _identityService;
        private readonly ICurrentUserService _currentUserService;

        public ChangeUserPasswordCommandHandler(IIdentityService identityService, ICurrentUserService currentUserService)
        {
            _identityService = identityService;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(ChangeUserPasswordCommand request, CancellationToken cancellationToken)
        {
            return await _identityService.ChangePassworAsync(_currentUserService.UserId, request.ChangePasswordData.CurrentPassword, request.ChangePasswordData.NewPassword);
        }
    }
}