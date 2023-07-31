using ACG.SGLN.Lottery.Application.ExcellencePrograms;
using ACG.SGLN.Lottery.Application.ExcellencePrograms.Queries.GetIncentives;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// Excellence Program
    /// </summary>
    [Authorize]
    public class ExcellenceProgramsController : ApiController
    {
        /// <summary>
        /// Get Incentives
        /// </summary>
        /// <returns></returns>
        [HttpGet("incentives")]
        public async Task<ActionResult<List<IncentiveDto>>> GetIncentives([FromQuery] IncentiveCriterea incentiveCriteria)
        {
            return await Mediator.Send(new GetIncentivesQuery { Criterea = incentiveCriteria });
        }
    }
}