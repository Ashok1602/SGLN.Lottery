using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Users;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using MediatR;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<string> GetUserNameAsync(string userId);
        Task<User> GetUserByIdAsync(string userId);
        Task<PagedResult<User>> GetUsersAsync(int? page, int? size, UserCriteria criteria);

        Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);
        Task<User> CreateUserAsync(User user);
        Task<User> UpdateUserAsync(string userId, User user);

        Task<Result> DeleteUserAsync(string userId);
        Task<Result> ChangePasswordAsync(string userId, string oldPassword, string newPassword);
        Task<Unit> ValidateUserAsync(string id);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByEmail(string email);
        Task<Unit> ChangePassworAsync(string userId, string currentPassword, string newPassword);
        Task<List<RoleDto>> GetRolesAsync();
        Task<Unit> ForgotPassworAsync(string email, Domain.Enums.RecoverType type = Domain.Enums.RecoverType.Email);

        Task<Unit> ResetPasswordAsync(string userId, string resetTokenCode, string password);

        Task<AuthenticationResult> SignUserIn(string email, string password, string deviceToken);

        Task<Unit> SignUserOut(string deviceToken);

        Task<Result> UpdateUserRoleAsync(string userId, string roleName);
        Task<List<User>> GetUserByRolesAsync(List<string> roles);
        Task<Unit> ToggleUserStatusAsync(string userId, bool isActive);
        Task<List<string>> GetUserClaimesAsync(string userId, string claimType);
        Task<List<string>> GetUserTokensAsync(string userId);
        Task<List<string>> GetUsersTokensAsync(List<string> userIds);
    }
}