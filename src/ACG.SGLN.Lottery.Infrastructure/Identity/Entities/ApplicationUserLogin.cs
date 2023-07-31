using Microsoft.AspNetCore.Identity;

namespace ACG.SGLN.Lottery.Infrastructure.Identity.Entities
{
    public class ApplicationUserLogin : IdentityUserLogin<string>
    {
        public virtual ApplicationUser User { get; set; }
    }
}