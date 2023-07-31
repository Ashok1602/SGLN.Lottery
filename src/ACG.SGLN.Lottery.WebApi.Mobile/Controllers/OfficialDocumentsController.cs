using ACG.SGLN.Lottery.Application.ApplicationDocuments.Queries.GetApplicationDocuments;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Mobile.Controllers
{
    /// <summary>
    /// Official Documents
    /// </summary>
    [Authorize]
    public class OfficialDocumentsController : ApiController
    {
        /// <summary>
        /// Get ApplicationDocuments list
        /// </summary>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <param name="ApplicationDocumentCriteria"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<PagedResult<ApplicationDocument>>> Get(int? page, int? size,
            [FromQuery] ApplicationDocumentCriterea ApplicationDocumentCriteria)
        {
            return await Mediator.Send(new GetApplicationDocumentsQuery { Page = page, Size = size, Criterea = ApplicationDocumentCriteria });
        }
    }
}