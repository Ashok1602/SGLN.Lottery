using Microsoft.AspNetCore.Identity;

namespace ACG.SGLN.Lottery.Infrastructure.Identity.Entities
{
    public class ApplicationRoleClaim : IdentityRoleClaim<string>
    {
        public virtual ApplicationRole Role { get; set; }
    }
}