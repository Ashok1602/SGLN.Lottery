using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Commands.UpdateUserRole
{
    public class UpdateUserRoleCommand : IRequest<Result>
    {
        public string UserId { get; set; }
        public string RoleName { get; set; }
    }
    public class UpdateUserRoleCommandHandler : IRequestHandler<UpdateUserRoleCommand, Result>,
        IApplicationRequestHandler<UpdateUserRoleCommand, Result>
    {
        private readonly IIdentityService _identityService;
        public UpdateUserRoleCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }
        public async Task<Result> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
        {
            return await _identityService.UpdateUserRoleAsync(request.UserId, request.RoleName);
        }
    }
}
