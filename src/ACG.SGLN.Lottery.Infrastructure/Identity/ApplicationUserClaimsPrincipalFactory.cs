using ACG.SGLN.Lottery.Infrastructure.Identity.Entities;
using IdentityModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Infrastructure.Identity
{
    internal class ApplicationUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser>
    {
        RoleManager<ApplicationRole> _roleManager;
        public ApplicationUserClaimsPrincipalFactory(
            UserManager<ApplicationUser> userManager,
            IOptions<IdentityOptions> optionsAccessor, RoleManager<ApplicationRole> roleManager)
            : base(userManager, optionsAccessor)
        {
            _roleManager = roleManager;
        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
        {
            var identity = await base.GenerateClaimsAsync(user);

            identity.AddClaim(new Claim(JwtClaimTypes.Name, user.FirstName + " " + (string.IsNullOrEmpty(user.LastName) ? "" : user.LastName)));

            List<Claim> claims = new List<Claim>();

            if (UserManager.SupportsUserRole)
            {
                IList<string> roles = await UserManager.GetRolesAsync(user);
                foreach (var roleName in roles)
                {
                    claims.Add(new Claim(JwtClaimTypes.Role, roleName));
                    if (_roleManager.SupportsRoleClaims)
                    {
                        ApplicationRole role = await _roleManager.FindByNameAsync(roleName);
                        if (role != null)
                        {
                            claims.AddRange(await _roleManager.GetClaimsAsync(role));
                        }
                    }
                }
            }

            identity.AddClaims(claims);

            return identity;
        }
    }
}