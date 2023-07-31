using MediatR.Behaviors.Authorization;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Application.Common.Authorizations
{
    public abstract class AbstractRoleBasedAuthorizer<TRequest> : AbstractRequestAuthorizer<TRequest>
    {
        protected abstract List<string> GetAllowedRoles();

        public AbstractRoleBasedAuthorizer()
        {
        }

        public override void BuildPolicy(TRequest request)
        {
            UseRequirement(new MustHaveRoleRequirement
            {
                RoleNames = GetAllowedRoles()
            });
        }
    }
}
