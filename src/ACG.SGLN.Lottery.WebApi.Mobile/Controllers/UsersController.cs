using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Users;
using ACG.SGLN.Lottery.Application.Users.Commands.DeleteUser;
using ACG.SGLN.Lottery.Application.Users.Commands.ForgotPassword;
using ACG.SGLN.Lottery.Application.Users.Commands.UpdateUser;
using ACG.SGLN.Lottery.Application.Users.Queries.GetConnectedUser;
using ACG.SGLN.Lottery.Application.Users.Queries.GetUserById;
using ACG.SGLN.Lottery.Application.Users.Queries.GetUsers;
using ACG.SGLN.Lottery.Application.Users.Queries.GetUsersByRoles;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
{
    /// <summary>
    /// Users
    /// </summary>
    [Authorize]
    public class UsersController : ApiController
    {
        /// <summary>
        /// Get users list
        /// </summary>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <param name="userCriteria"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<PagedResult<User>>> Get(int? page, int? size,
            [FromQuery] UserCriteria userCriteria)
        {
            return await Mediator.Send(new GetUsersQuery { Page = page, Size = size, Criterea = userCriteria });
        }

        /// <summary>
        /// Get user by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetById(string id)
        {
            return await Mediator.Send(new GetUserByIdQuery { Id = id });
        }

        /// <summary>
        /// Get Users by role 
        /// </summary>
        /// <param name="rolenames">User RoleName</param>
        /// <returns></returns>
        [HttpGet("roles")]
        public async Task<ActionResult<List<User>>> GetByRoles([FromQuery] List<string> rolenames)
        {
            return await Mediator.Send(new GetUsersByRolesQuery { Roles = rolenames });
        }

        /// <summary>
        /// Get logged in user
        /// </summary>
        /// <returns></returns>
        [HttpGet("current")]
        public async Task<ActionResult<User>> GetConnectedUser()
        {
            return await Mediator.Send(new GetConnectedUserQuery());
        }

        /// <summary>
        /// Changes usr passuser
        /// </summary>
        /// <param name="changePasswordData"></param>
        /// <returns></returns>
        [HttpPost("password/change")]
        public async Task<ActionResult<Unit>> ChangePassword([FromBody] ChangePasswordData changePasswordData)
        {
            return await Mediator.Send(new ChangeUserPasswordCommand { ChangePasswordData = changePasswordData });
        }


        /// <summary>
        /// Update user details 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userUpdateDto"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUser(string id, UserUpdateDto userUpdateDto)
        {
            return await Mediator.Send(new UpdateUserCommand { Id = id, Data = userUpdateDto });
        }

        /// <summary>
        /// Init ForgotPassword
        /// </summary>
        /// <param name="phone"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("ForgotPassword")]
        public async Task<ActionResult<Unit>> ForgotPassword([FromBody] string phone)
        {
            return await Mediator.Send(new ForgotPasswordCommand { RecoverInput = phone, Type = Domain.Enums.RecoverType.Phone });
        }

        /// <summary>
        /// Reset Password
        /// </summary>
        /// <param name="newPassword"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        [HttpPost("ResetPassword")]
        public async Task<ActionResult<Unit>> ResetPassword(string newPassword, string code)
        {
            return await Mediator.Send(new ResetPasswordCommand { Password = newPassword, ResetTokenCode = code });
        }

    }
}