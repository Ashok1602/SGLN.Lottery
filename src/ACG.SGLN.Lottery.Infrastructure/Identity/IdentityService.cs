using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Extensions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Users;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.Domain.Options;
using ACG.SGLN.Lottery.Infrastructure.Identity.Entities;
using ACG.SGLN.Lottery.Infrastructure.Persistence;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using static ACG.SGLN.Lottery.Domain.Constants.AuthorizationConstants;
using static ACG.SGLN.Lottery.Domain.Constants.ConfigurationConstants;
using ApplicationException = ACG.SGLN.Lottery.Application.Common.Exceptions.ApplicationException;
using ClaimTypes = ACG.SGLN.Lottery.Domain.Constants.AuthorizationConstants.ClaimTypes;

namespace ACG.SGLN.Lottery.Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IEmailSender _emailSender;
        private readonly IMessageService _messageService;
        private readonly IPushNotificationSender _pushNotificationSender;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly SecurityOptions _securityOptions;
        private readonly MessagingOptions _MessagingOptions;


        public IdentityService(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext, IMapper mapper,
            IEmailSender emailSender, RoleManager<ApplicationRole> roleManager, SignInManager<ApplicationUser> signInManager,
            IOptions<SecurityOptions> securityOptions, IPushNotificationSender pushNotificationSender, IMessageService messageService, IOptions<MessagingOptions> messagingOptions)
        {
            _MessagingOptions = messagingOptions.Value;
            _userManager = userManager;
            _dbContext = dbContext;
            _mapper = mapper;
            _emailSender = emailSender;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _securityOptions = securityOptions?.Value;
            _pushNotificationSender = pushNotificationSender;
            _messageService = messageService;
        }

        public async Task<List<RoleDto>> GetRolesAsync()
        {
            return await _roleManager.Roles
                .Where(r => r.Name != Roles.Retailers && r.Name != Roles.Administrators)
                .Select(r => new RoleDto
                {
                    Id = r.Id,
                    RoleName = r.Name
                }).ToListAsync();
        }

        public async Task<string> GetUserNameAsync(string userId)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);

            return user?.UserName;
        }

        public async Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password)
        {
            var user = new ApplicationUser
            {
                UserName = userName,
                Email = userName
            };

            var result = await _userManager.CreateAsync(user, password);

            return (result.ToApplicationResult(), user.Id);
        }

        public async Task<Result> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new NotFoundException(nameof(User), userId);

            return await DeleteUserAsync(user);
        }

        public Task<User> GetUserByIdAsync(string userId)
        {
            var user = _dbContext.Users.Where(e => e.Id == userId)
                .ProjectTo<User>(_mapper.ConfigurationProvider)
                .FirstOrDefault();

            return Task.FromResult(user);
        }

        public Task<PagedResult<User>> GetUsersAsync(int? page, int? size, UserCriteria criteria)
        {
            var userQuery = _dbContext.ApplySpecification(new UserSearchSpecification(criteria));

            var users = userQuery
                .ProjectTo<User>(_mapper.ConfigurationProvider)
                .OrderByDescending(t => t.Created)
                .GetPaged(page.GetValueOrDefault(1),
                    size.GetValueOrDefault(CoreConstants.DefaultPageSize));

            return users;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            var appUser = _mapper.Map<ApplicationUser>(user);

            if (string.IsNullOrEmpty(user.UserName))
                appUser.UserName = user.Email.Split("@")[0];
            else
                appUser.UserName = user.UserName;

            appUser.Id = Guid.NewGuid().ToString();

            appUser.UserName = appUser.UserName.Replace(" ", "");
            appUser.Created = DateTime.Now;

            string password = "";
            appUser.IsTemporayPassword = true;

            if (user.RoleName != Roles.Retailers)
            {
                password = PasswordGenerator.Generate();
                user.IsValidated = true;
            }
            else
                password = DefaultPassword;

            var userExist = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (userExist != null)
                throw new ApplicationException("Cet utilisateur existe déjà, Veuillez réessayer avec un nouveau email");

            var result = await _userManager.CreateAsync(appUser, password);

            if (result.Succeeded)
            {
                if (string.IsNullOrWhiteSpace(user.RoleName))
                    user.RoleName = Roles.Retailers;
                await _userManager.AddToRoleAsync(appUser, user.RoleName);
                if (user.RoleName != Roles.Retailers) // Retailers should not get access only when they're validated
                {
                    try
                    {
                        UserCreateDto Mailuser = new UserCreateDto { Email = user.Email, FirstName = appUser.FirstName, LastName = appUser.LastName, Password = password, UserName = appUser.UserName };
                        await _emailSender.SendEmailAsync<UserCreateDto>(Mailuser.Email, "Compte SGLN", TemplatesNames.Emails.UserRegistration, Mailuser);
                    }
                    catch (Exception)
                    {
                    };
                }
            }
            else
                throw new ApplicationException("Cet utilisateur existe déjà, Veuillez réessayer avec un nouveau email");
            user.Id = appUser.Id;
            return user;
        }

        public async Task<User> UpdateUserAsync(string userId, User user)
        {
            var entity = await _userManager.FindByIdAsync(userId);

            if (entity == null)
                throw new NotFoundException(nameof(User), userId);

            if (!string.IsNullOrEmpty(user.RoleName))
            {
                var roles = await _userManager.GetRolesAsync(entity);

                await _userManager.RemoveFromRolesAsync(entity, roles);
                await _userManager.AddToRoleAsync(entity, user.RoleName);

                if (roles.Contains(Roles.Retailers))
                {
                    var retailer = _dbContext.Retailers.Where(c => c.UserId == user.Id).FirstOrDefault();
                    if (retailer != null)
                    {
                        retailer.FirstName = user.FirstName;
                        retailer.LastName = user.LastName;
                        retailer.Phone = user.PhoneNumber;
                        retailer.Email = user.Email;

                        _dbContext.Entry(retailer).State = EntityState.Modified;
                        await _dbContext.SaveChangesAsync();
                    }
                }
            }

            var updateUser = MapNewData(entity, user);
            updateUser.LastModified = DateTime.Now;

            var result = await _userManager.UpdateAsync(updateUser);

            if (result.Succeeded)
                return _mapper.Map<User>(entity);

            return null;
        }

        public async Task<Result> ChangePasswordAsync(string userId, string oldPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new NotFoundException(nameof(User), userId);

            var result = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);

            return result.ToApplicationResult();
        }

        private async Task<Result> DeleteUserAsync(ApplicationUser user)
        {
            if (user.UserRoles.Any(ur => ur.Role.Name == Roles.Administrators))
                throw new ApplicationException("Un Administrateur ne peut pas être supprimé.");

            user.IsDeleted = true;

            var result = await _userManager.UpdateAsync(user);

            return result.ToApplicationResult();
        }

        public ApplicationUser MapNewData(ApplicationUser entity, User user)
        {
            if (!string.IsNullOrWhiteSpace(user.FirstName)) entity.FirstName = user.FirstName;
            if (!string.IsNullOrWhiteSpace(user.LastName)) entity.LastName = user.LastName;
            if (!string.IsNullOrWhiteSpace(user.UserName)) entity.UserName = user.UserName;
            if (!string.IsNullOrWhiteSpace(user.PhoneNumber)) entity.PhoneNumber = user.PhoneNumber;
            if (!string.IsNullOrWhiteSpace(user.LastModifiedBy)) entity.LastModifiedBy = user.LastModifiedBy;

            return entity;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                throw new NotFoundException(nameof(User), email);

            return _mapper.Map<User>(user);
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user != null)
                return _mapper.Map<User>(user);
            else
                return null;
        }

        public async Task<List<User>> GetUserByRolesAsync(List<string> roles)
        {
            var users = new List<User>();

            foreach (var role in roles)
            {
                var roleuser = _mapper.Map<List<User>>(await _userManager.GetUsersInRoleAsync(role));
                roleuser.ForEach(r => r.RoleName = role);
                users.AddRange(roleuser);
            }
            return users;
        }
        public async Task<Result> UpdateUserRoleAsync(string userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new NotFoundException(nameof(User), userId);

            var userRole = _dbContext.UserRoles.Where(c => c.UserId == user.Id).FirstOrDefault();

            if (userRole != null)
            {
                var roles = _dbContext.Roles.Where(c => c.Id == userRole.RoleId);

                foreach (var role in roles)
                {
                    var remove = await _userManager.RemoveFromRoleAsync(user, role.Name);
                }
            }

            var result = await _userManager.AddToRoleAsync(user, roleName);

            return result.ToApplicationResult();
        }

        public async Task<List<string>> GetUserClaimesAsync(string userId, string claimType)
        {
            List<string> claimes = new List<string>();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return claimes;

            claimes.AddRange((await _userManager.GetClaimsAsync(user)).Select(e => e.Value).ToList());

            var roleNames = await _userManager.GetRolesAsync(user);

            foreach (var roleName in roleNames)
                claimes.AddRange((await _roleManager.GetClaimsAsync(await _roleManager.FindByNameAsync(roleName))).Select(e => e.Value).ToList());

            return claimes;
        }

        public async Task<Unit> ToggleUserStatusAsync(string userId, bool isActive)
        {
            var entity = await _userManager.FindByIdAsync(userId);

            if (entity == null)
                throw new NotFoundException(nameof(User), userId);

            entity.IsDeactivated = !isActive;

            var result = await _userManager.UpdateAsync(entity);

            return Unit.Value;
        }

        public async Task<AuthenticationResult> SignUserIn(string userName, string password, string deviceToken)
        {
            ApplicationUser userToVerify = await _userManager.FindByNameAsync(userName);

            if (userToVerify == null)
                return await Task.FromResult<AuthenticationResult>(new AuthenticationResult() { Succeeded = false, Errors = new List<string>() { "Nom utilisateur invalide." } });

            if (((!userToVerify.IsValidated) && userToVerify.UserRoles.Any(ur => ur.Role.Name == Roles.Retailers)) || userToVerify.IsDeactivated)
                return await Task.FromResult<AuthenticationResult>(new AuthenticationResult() { Succeeded = false, Errors = new List<string>() { "Votre compte est temporairement désactivé ou nécessite une validation." } });

            SignInResult signResult =
                        await _signInManager.PasswordSignInAsync(userName, password, false, false);

            if (signResult.Succeeded)
            {
                var identity = new ClaimsIdentity();

                List<Claim> claims = new List<Claim>();

                claims.Add(new Claim(ClaimTypes.UserId, userToVerify.Id));
                claims.Add(new Claim(ClaimTypes.FullName, userToVerify.FirstName + " " + (string.IsNullOrEmpty(userToVerify.LastName) ? "" : userToVerify.LastName)));
                claims.Add(new Claim(ClaimTypes.Administration, userToVerify.Administration + ""));
                if (_userManager.SupportsUserRole)
                {
                    IList<string> roles = await _userManager.GetRolesAsync(userToVerify);
                    foreach (var roleName in roles)
                    {
                        claims.Add(new Claim(ClaimTypes.Role, roleName));
                        if (_roleManager.SupportsRoleClaims)
                        {
                            ApplicationRole role = await _roleManager.FindByNameAsync(roleName);
                            if (role != null)
                            {
                                claims.AddRange(await _roleManager.GetClaimsAsync(role));
                            }
                        }
                    }
                }

                identity.AddClaims(claims);
                if (!string.IsNullOrEmpty(deviceToken) && userToVerify.UserRoles.Any(ur => ur.Role.Name == Roles.Retailers))
                {
                    bool exists = _dbContext.UserTokens.Any(u => (u.UserId == userToVerify.Id) && (u.Value == deviceToken));
                    if (!exists)
                    {
                        await _dbContext.UserTokens.AddAsync(new ApplicationUserToken
                        {
                            LoginProvider = Guid.NewGuid().ToString(),
                            User = userToVerify,
                            Name = DefaultDeviceTokenName,
                            Value = deviceToken,
                            Created = DateTime.Now
                        });
                        await _pushNotificationSender.SubscribeToTopicAsync(deviceToken, Topics.All);
                        await _dbContext.SaveChangesAsync();
                    }
                }

                AuthenticationResult result = new AuthenticationResult()
                {
                    Succeeded = signResult.Succeeded,
                    IsLockedOut = signResult.IsLockedOut,
                    IsNotAllowed = signResult.IsNotAllowed
                };

                result.AccessToken = GetToken(identity);
                result.IsTemporaryPassword = userToVerify.IsTemporayPassword;
                return result;
            }
            else
            {
                if (userToVerify.LoginAttempt < 3)
                {
                    userToVerify.LoginAttempt++;
                    await _userManager.UpdateAsync(userToVerify);
                }
                else
                {
                    ForgotPassworAsync(userToVerify.Email, Domain.Enums.RecoverType.Email);
                    //var newpassword = PasswordGenerator.Generate();
                    //string resetToken = await _userManager.GeneratePasswordResetTokenAsync(userToVerify);
                    //await ResetPasswordAsync(userToVerify.Id, resetToken, newpassword);
                    return await Task.FromResult<AuthenticationResult>(new AuthenticationResult() { IsLockedOut = true, Succeeded = false, Errors = new List<string>() { "Mot de passe invalide, un email de réinitialisation du mot de passe vous a été envoyé" } });
                }
            }

            return await Task.FromResult<AuthenticationResult>(new AuthenticationResult() { Succeeded = false, Errors = new List<string>() { "Mot de passe invalide" } });
        }

        public async Task<Unit> SignUserOut(string deviceToken)
        {
            if (!string.IsNullOrEmpty(deviceToken))
            {
                var usertoken = _dbContext.UserTokens.Where(u => u.Value == deviceToken).FirstOrDefault();
                if (usertoken != null)
                    _dbContext.UserTokens.Remove(usertoken);
                await _pushNotificationSender.UnSubscribeFromTopicAsync(deviceToken, Topics.All);
                await _dbContext.SaveChangesAsync();
            }

            await _signInManager.SignOutAsync();
            return Unit.Value;
        }

        private string GetToken(ClaimsIdentity identity)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(_securityOptions.JwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.UtcNow.AddMonths(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature),
            };
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<Unit> ChangePassworAsync(string userId, string currentPassword, string newPassword)
        {
            ApplicationUser appUser = await _userManager.FindByIdAsync(userId);
            if (appUser == null)
                throw new NotFoundException(nameof(User), userId);

            var result = await _userManager.ChangePasswordAsync(appUser, currentPassword, newPassword);
            if (result.Succeeded)
            {
                appUser.IsTemporayPassword = false;
                await _dbContext.SaveChangesAsync();
                return Unit.Value;
            }

            throw new ApplicationException("Le mot de passe doit contenir au minimum 8 caractères, une lettre majuscule, un chiffre et un caractère spécial.");
        }

        public async Task<Unit> ForgotPassworAsync(string email, Domain.Enums.RecoverType type = Domain.Enums.RecoverType.Email)
        {
            ApplicationUser appUser = await _userManager.FindByEmailAsync(email);

            if (appUser == null)
                throw new NotFoundException(nameof(User), email);

            try
            {
                if (type == Domain.Enums.RecoverType.Email)
                {
                    string resetToken = await _userManager.GeneratePasswordResetTokenAsync(appUser);
                    UserCreateDto Mailuser = new UserCreateDto { Email = appUser.Email, FirstName = appUser.FirstName, LastName = appUser.LastName, Token = resetToken, UserName = appUser.UserName };
                    await _emailSender.SendEmailAsync<UserCreateDto>(Mailuser.Email, "Réintialisation de mot de passe", TemplatesNames.Emails.ForgotPassword, Mailuser);
                }
                //else 
                //{
                //    var password = PasswordGenerator.Generate();
                //    await _userManager.RemovePasswordAsync(appUser);
                //    await _userManager.AddPasswordAsync(appUser, password);
                //    var result = await _userManager.UpdateAsync(appUser);

                //    return await _messageService.SendSmsByShortLink(new List<string>() { _MessagingOptions.DefaultCodeCountry + appUser.PhoneNumber }, "SGLN - Réintialisez votre mot de passe, veuillez utiliser le mot de passe suivant : " + password);
                //}
            }
            catch (Exception)
            {
            };
            return Unit.Value;
        }

        public async Task<Unit> ResetPasswordAsync(string userId, string resetTokenCode, string password)
        {
            ApplicationUser appUser = await _userManager.FindByIdAsync(userId);
            if (appUser == null)
                throw new NotFoundException(nameof(User), userId);

            StringWriter myWriter = new StringWriter();
            HttpUtility.HtmlDecode(resetTokenCode, myWriter);
            string myDecodedString = myWriter.ToString();

            var result = await _userManager.ResetPasswordAsync(appUser, myDecodedString, password);

            if (result.Succeeded)
            {
                appUser.LoginAttempt = 0;
                appUser.IsTemporayPassword = false;
                await _dbContext.SaveChangesAsync();
                return Unit.Value;
            }

            throw new ApplicationException("Le mot de passe doit contenir au minimum 8 caractères, une lettre majuscule, un chiffre et un caractère spécial.");
        }

        public async Task<List<string>> GetUserTokensAsync(string userId)
        {
            return await _dbContext.UserTokens.Where(u => u.UserId == userId).Select(t => t.Value).ToListAsync();
        }


        public async Task<List<string>> GetUsersTokensAsync(List<string> userIds)
        {
            return await _dbContext.UserTokens.Where(u => userIds.Contains(u.UserId)).Select(t => t.Value).ToListAsync();
        }

        public async Task<Unit> ValidateUserAsync(string userId)
        {
            var entity = await _dbContext.Users
                .Where(u => u.Id == userId)
                .Include(t => t.UserRoles)
                .Include("UserRoles.Role")
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(User), userId);

            entity.IsValidated = true;

            var password = PasswordGenerator.Generate();

            await _userManager.RemovePasswordAsync(entity);
            await _userManager.AddPasswordAsync(entity, password);

            var result = await _userManager.UpdateAsync(entity);

            try
            {
                //if (entity.UserRoles.Any(ur => ur.Role.Name == Roles.Retailers) && !string.IsNullOrWhiteSpace(entity.PhoneNumber))
                //{
                //    return await _messageService.SendSmsByShortLink(new List<string>() { entity.PhoneNumber }, "Compte Détaillant, SGLN vous remercie pour votre inscription, votre mot de passe est " + password);
                //}
                //else
                //{
                UserCreateDto Mailuser = new UserCreateDto { Email = entity.Email, FirstName = entity.FirstName, LastName = entity.LastName, Password = password, UserName = entity.UserName };
                await _emailSender.SendEmailAsync<UserCreateDto>(Mailuser.Email, "Compte Détaillant Loterie National", TemplatesNames.Emails.UserRegistration, Mailuser);
                //}
            }
            catch (Exception)
            {
            };

            return Unit.Value;
        }

    }
}