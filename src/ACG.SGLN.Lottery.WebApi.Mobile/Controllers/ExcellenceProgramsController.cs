using ACG.SGLN.Lottery.Application.ExcellencePrograms;
using ACG.SGLN.Lottery.Application.ExcellencePrograms.Queries.GetExcellenceProgram;
using ACG.SGLN.Lottery.Application.ExcellencePrograms.Queries.GetIncentives;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
{
    /// <summary>
    /// Excellence Program
    /// </summary>
    [Authorize]
    public class ExcellenceProgramsController : ApiController
    {
        /// <summary>
        /// Get Excellence Program
        /// </summary>
        /// <returns></returns>
        [HttpGet("classification")]
        public async Task<ActionResult<ExcellenceProgramDto>> GetRetailerClassification()
        {
            return await Mediator.Send(new GetExcellenceProgramQuery { });
        }

        /// <summary>
        /// Get Incentives
        /// </summary>
        /// <returns></returns>
        [HttpGet("incentives")]
        public async Task<ActionResult<List<IncentiveDto>>> GetIncentives()
        {
            return await Mediator.Send(new GetIncentivesQuery { });
        }
    }
}