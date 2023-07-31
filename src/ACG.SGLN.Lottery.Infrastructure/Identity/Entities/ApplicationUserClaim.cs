using Microsoft.AspNetCore.Identity;

namespace ACG.SGLN.Lottery.Infrastructure.Identity.Entities
{
    public class ApplicationUserClaim : IdentityUserClaim<string>
    {
        public virtual ApplicationUser User { get; set; }
    }
}