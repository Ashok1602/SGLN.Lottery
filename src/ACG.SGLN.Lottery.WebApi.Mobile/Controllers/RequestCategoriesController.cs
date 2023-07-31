using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.RequestCategorys.Queries.GetStrippedRequestCategorys;
using ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetRequestObjects;
using ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetStrippedRequestObjects;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.Domain.Enums;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Mobile.Controllers
{
    /// <summary>
    /// RequestCategories 
    /// </summary>
    public class RequestCategoriesController : BaseController<RequestCategory, Guid>
    {

        /// <summary>
        /// List all RequestCategorys
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<PagedResult<RequestCategory>>> Get(int? page, int? size, [FromQuery] RequestCategoriesCriterea RequestCategoryCriteria)
        {
            return await Mediator.Send(new GetRequestCategoriesQuery { Page = page, Size = size, Criterea = RequestCategoryCriteria });
        }


        /// <summary>
        /// List all RequestObjects
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("stripped")]
        public async Task<ActionResult<List<IdValueDto<Guid>>>> GetStripped()
        {
            return await Mediator.Send(new GetStrippedRequestCategoriesQuery { IsPublished = true });
        }

        /// <summary>
        /// List all RequestObjects
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("{requestNature}/stripped")]
        public async Task<ActionResult<List<IdValueDto<Guid>>>> GetStrippedByNature(RequestNatureType requestNature)
        {
            return await Mediator.Send(new GetStrippedRequestCategoriesByNatureQuery { RequestNature = requestNature, IsPublished = true });
        }

    }
}
