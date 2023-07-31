using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class User : IDeletableEntity, IAuditableEntity<string>
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public bool? EmailConfirmed { get; set; }
        public bool? PhoneNumberConfirmed { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Created { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime? LastModified { get; set; }
        public bool? IsExternal { get; set; }
        public bool? IsDeleted { get; set; }
        public bool IsDeactivated { get; set; } = false;
        public bool IsValidated { get; set; } = false;
        public ProcessingDirectionType? Administration { get; set; } = null;

        public string RoleName { get; set; }
        public List<string> Permissions { get; set; }
    }
}