using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Constants;
using MediatR.Behaviors.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Authorizations
{
    public class MustHavePermissionRequirement : IAuthorizationRequirement
    {
        public List<string> Permissions { get; set; }

        private class MustHavePermissionRequirementHandler : IAuthorizationHandler<MustHavePermissionRequirement>
        {
            private readonly ICurrentUserService _currentUserService;
            private readonly IIdentityService _identityService;

            public MustHavePermissionRequirementHandler(ICurrentUserService currentUserService, IIdentityService identityService)
            {
                _currentUserService = currentUserService;
                _identityService = identityService;
            }

            public async Task<AuthorizationResult> Handle(MustHavePermissionRequirement request,
                CancellationToken cancellationToken)
            {
                var userPermissions = await _identityService.GetUserClaimesAsync(_currentUserService.UserId, AuthorizationConstants.ClaimTypes.Permissions);
                if (userPermissions.Intersect(request.Permissions).Any() || _currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Administrators))
                    return AuthorizationResult.Succeed();

                return AuthorizationResult.Fail($"You don't have permission to perform this action [{string.Join(", ", request.Permissions.ToArray())}].");
            }
        }
    }
}