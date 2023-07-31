
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Users;
using ACG.SGLN.Lottery.Application.Users.Commands.UpdateUser;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
{
    /// <summary>
    /// Auth
    /// </summary>
    public class AuthController : ApiController
    {
        /// <summary>
        /// Signing IN
        /// </summary>
        [AllowAnonymous]
        [HttpPost("signin")]
        public async Task<ActionResult<AuthenticationResult>> SignIn([FromBody] UserSignInDto userSignInData)
        {
            return await Mediator.Send(new UserSignInCommand { Data = userSignInData }); ;
        }

        /// <summary>
        /// Logging out
        /// </summary>
        [HttpPost("logout")]
        public async void LogOut([FromBody] string deviceToken)
        {
            await Mediator.Send(new UserSignOutCommand { DeviceToken = deviceToken }); ;
        }
    }
}