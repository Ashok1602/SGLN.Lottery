using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;

namespace ACG.SGLN.Lottery.Application.Users
{
    public class UserUpdateDto : IMapFrom<User>, IMapTo<User>
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public string RoleName { get; set; }
        public ProcessingDirectionType? Administration { get; set; }

    }
}