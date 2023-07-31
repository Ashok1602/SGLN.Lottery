using System;

namespace ACG.SGLN.Lottery.Domain.Common
{
    public interface IAuditableEntity<TUser>
    {
        public TUser CreatedBy { get; set; }
        public DateTime Created { get; set; }
        public TUser LastModifiedBy { get; set; }
        public DateTime? LastModified { get; set; }
    }
}