using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using ClaimTypes = ACG.SGLN.Lottery.Domain.Constants.AuthorizationConstants.ClaimTypes;

namespace ACG.SGLN.Lottery.WebUI.Common.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            UserId = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.UserId);
            UserName = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.FullName);
            RoleNames = httpContextAccessor.HttpContext?.User?.FindAll(ClaimTypes.Role)?.Select(e => e.Value).ToList();
            string administrationClaim = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Administration);
            if (!string.IsNullOrEmpty(administrationClaim))
                Administration = (ProcessingDirectionType)(Enum.Parse(typeof(ProcessingDirectionType), administrationClaim));
        }

        public string UserId { get; }
        public string UserName { get; }
        public List<string> RoleNames { get; }
        public ProcessingDirectionType? Administration { get; } = null;
    }
}