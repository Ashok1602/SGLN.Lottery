using ACG.SGLN.Lottery.Application.Roles.Queries.GetRoles;
using ACG.SGLN.Lottery.Application.Users;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// Roles
    /// </summary>
    [Authorize]
    public class RolesController : ApiController
    {

        /// <summary>
        /// Get roles
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<List<RoleDto>>> Get()
        {
            return await Mediator.Send(new GetRolesQuery { });
        }
    }
}