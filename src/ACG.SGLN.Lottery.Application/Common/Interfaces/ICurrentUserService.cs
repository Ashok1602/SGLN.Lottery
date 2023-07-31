using ACG.SGLN.Lottery.Domain.Enums;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface ICurrentUserService
    {
        string UserId { get; }
        public string UserName { get; }
        List<string> RoleNames { get; }
        ProcessingDirectionType? Administration { get; }

        public bool IsLoggedIn() => !string.IsNullOrEmpty(UserId);
    }
}