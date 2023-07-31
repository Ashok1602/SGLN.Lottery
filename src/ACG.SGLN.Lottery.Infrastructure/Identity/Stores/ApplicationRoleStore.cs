using ACG.SGLN.Lottery.Infrastructure.Identity.Entities;
using ACG.SGLN.Lottery.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ACG.SGLN.Lottery.Infrastructure.Identity.Stores
{
    public class ApplicationRoleStore : RoleStore<ApplicationRole, ApplicationDbContext,
        string, ApplicationUserRole, ApplicationRoleClaim>
    {
        public ApplicationRoleStore(ApplicationDbContext context, IdentityErrorDescriber describer = null)
            : base(context, describer)
        {
        }
    }
}