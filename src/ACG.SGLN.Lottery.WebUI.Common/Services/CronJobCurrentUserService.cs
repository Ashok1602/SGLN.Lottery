using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.WebUI.Common.Services
{
    public class CronJobCurrentUserService : ICurrentUserService
    {
        public CronJobCurrentUserService()
        {
            UserId = Guid.NewGuid().ToString();
            UserName = "CronJobUser";
            RoleNames = new List<string>() { AuthorizationConstants.Roles.Administrators };
        }

        public string UserId { get; }
        public string UserName { get; }
        public List<string> RoleNames { get; }

        public ProcessingDirectionType? Administration { get; } = null;
    }
}