using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ACG.SGLN.Lottery.Infrastructure.Identity.Entities
{
    public class ApplicationUser : IdentityUser<string>, IMapTo<User>, IMapFrom<User>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public virtual ICollection<ApplicationUserClaim> Claims { get; set; }
        public virtual ICollection<ApplicationUserLogin> Logins { get; set; }
        public virtual ICollection<ApplicationUserToken> Tokens { get; set; }
        public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }

        public string CreatedBy { get; set; }
        public DateTime Created { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime? LastModified { get; set; }
        public bool? IsExternal { get; set; }
        public bool? IsDeleted { get; set; }
        public bool IsDeactivated { get; set; } = false;
        public bool IsTemporayPassword { get; set; }
        public int LoginAttempt { get; set; } = 0;
        public bool IsValidated { get; set; } = false;
        public ProcessingDirectionType? Administration { get; set; } = null;

        public virtual void Mapping(Profile profile)
        {
            profile.CreateMap<ApplicationUser, User>()
                .ForMember(d => d.RoleName, o => o.MapFrom(s => s.UserRoles.Select(ur => ur.Role.Name).FirstOrDefault()));
            profile.CreateMap<User, ApplicationUser>();
        }
    }
}