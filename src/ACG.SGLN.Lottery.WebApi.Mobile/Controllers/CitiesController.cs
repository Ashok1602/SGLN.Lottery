using ACG.SGLN.Lottery.Application.RefData.Queries;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
{
    /// <summary>
    /// Cities
    /// </summary>
    public class CitiesController : BaseController<City, int>
    {
        /// <summary>
        /// List of cities
        /// </summary>
        /// <returns></returns>
        //[AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<string>>> Get()
        {
            return await Mediator.Send(new GetCitiesQuery());
        }
    }
}
