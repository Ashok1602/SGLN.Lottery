using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class UserCriteria
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string RoleId { get; set; }

        public bool? IsDeactivated { get; set; }

        public List<string> Roles { get; set; } = new List<string>();
    }
}