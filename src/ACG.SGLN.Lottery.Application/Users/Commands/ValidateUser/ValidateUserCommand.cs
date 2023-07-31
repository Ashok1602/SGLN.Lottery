using ACG.SGLN.Lottery.Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Commands.ValidateUser
{
    public class ValidateUserCommand : IRequest<Unit>
    {
        public string Id { get; set; }
    }

    public class ValidateUserCommandHandler : IRequestHandler<ValidateUserCommand, Unit>,
        IApplicationRequestHandler<ValidateUserCommand, Unit>
    {
        private readonly IIdentityService _identityService;

        public ValidateUserCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<Unit> Handle(ValidateUserCommand request,
            CancellationToken cancellationToken)
        {
            return await _identityService.ValidateUserAsync(request.Id);
        }
    }
}