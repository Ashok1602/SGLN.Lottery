using ACG.SGLN.Lottery.Application.Common.Authorizations;
using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Commands.DeleteUser
{
    [AnonymousAccess]
    public class ResetPasswordCommand : IRequest<Unit>
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string ResetTokenCode { get; set; }

    }

    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Unit>,
        IApplicationRequestHandler<ResetPasswordCommand, Unit>
    {
        private readonly IIdentityService _identityService;
        private readonly ICurrentUserService _currentUserService;

        public ResetPasswordCommandHandler(IIdentityService identityService, ICurrentUserService currentUserService)
        {
            _identityService = identityService;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            if (_currentUserService != null && _currentUserService.UserId != null)
                return await _identityService.ResetPasswordAsync(_currentUserService.UserId, request.ResetTokenCode, request.Password);
            else
            {
                User user = await _identityService.GetUserByEmailAsync(request.Email);
                if (user == null)
                    throw new NotFoundException(nameof(User), request.Email);
                return await _identityService.ResetPasswordAsync(user.Id, request.ResetTokenCode, request.Password);
            }

        }
    }
}