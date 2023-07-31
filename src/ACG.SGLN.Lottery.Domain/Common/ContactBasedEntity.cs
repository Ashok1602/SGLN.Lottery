using System;

namespace ACG.SGLN.Lottery.Domain.Common
{
    public abstract class ContactBasedEntity : BaseEntity<Guid>
    {
        public string City { get; set; }

        public string Address { get; set; }

        public string AddressLine2 { get; set; }

        public string Zip { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }
    }
}