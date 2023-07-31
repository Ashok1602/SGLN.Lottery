using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetRequestObjects;
using ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetRequestObjectsValidity;
using ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetStrippedRequestObjects;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// RequestObjects (for testing)
    /// </summary>
    public class RequestObjectsController : BaseController<RequestObject, Guid>
    {
        /// <summary>
        /// List all RequestObjects
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<PagedResult<RequestObject>>> Get(int? page, int? size, [FromQuery] RequestObjectCriterea requestObjectCriteria)
        {
            return await Mediator.Send(new GetRequestObjectsQuery { Page = page, Size = size, Criterea = requestObjectCriteria, IsPublished = true });
        }

        /// <summary>
        /// List all RequestObjects
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("{requestCategoryId}/stripped")]
        public async Task<ActionResult<List<IdValueDto<Guid>>>> GetStrippedByCategory(Guid requestCategoryId)
        {
            return await Mediator.Send(new GetStrippedRequestObjectsQuery { RequestCategoryId = requestCategoryId, IsPublished = true });
        }



        /// <summary>
        /// Get Whether list is valid or not
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("validity")]
        public async Task<ActionResult<bool>> GetValidity([FromBody] DateTime lastUpdated)
        {
            return await Mediator.Send(new GetRequestObjectsValidityQuery { LastUpdated = lastUpdated });
        }
    }
}
