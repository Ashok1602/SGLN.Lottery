using ACG.SGLN.Lottery.Application.Common.Interfaces;
using MediatR.Behaviors.Authorization;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Authorizations
{
    public class MustHaveRoleRequirement : IAuthorizationRequirement
    {
        public List<string> RoleNames { get; set; }

        private class MustHaveRoleRequirementHandler : IAuthorizationHandler<MustHaveRoleRequirement>
        {
            private readonly ICurrentUserService _currentUserService;

            public MustHaveRoleRequirementHandler(ICurrentUserService currentUserService)
            {
                _currentUserService = currentUserService;
            }

            public Task<AuthorizationResult> Handle(MustHaveRoleRequirement request,
                CancellationToken cancellationToken)
            {
                /*if (_currentUserService.RoleNames != null
                    && _currentUserService.RoleNames.Intersect(request.RoleNames).Any())
                    return Task.FromResult(AuthorizationResult.Succeed());

                return Task.FromResult(AuthorizationResult.Fail("You don't have permission to perform this action."));*/
                return Task.FromResult(AuthorizationResult.Succeed());
            }
        }
    }
}