using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Infrastructure.Identity.Entities
{
    public class ApplicationRole : IdentityRole<string>
    {
        public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
        public virtual ICollection<ApplicationRoleClaim> RoleClaims { get; set; }

        public ApplicationRole()
        {
        }

        public ApplicationRole(string roleName) : base(roleName)
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}