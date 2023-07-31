using ACG.SGLN.Lottery.Application.Retailers;
using ACG.SGLN.Lottery.Application.Retailers.Commands;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// Mise à jour des données BA/facture
    /// </summary>
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DataIntegrationController : ControllerBase
    {
        private IMediator _mediator;

        private IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();


        /// <summary>
        /// Add new Retailers and create a user account for them
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost("retailers")]
        public async Task<ActionResult<List<Retailer>>> CreateRetailers([FromBody] List<RetailerDto> data)
        {
            return await Mediator.Send(new CreateRetailersCommand { Data = data });
        }

        /// <summary>
        /// Update Retailers
        /// </summary>
        /// <returns></returns>
        [HttpPut("retailers")]
        public async Task<ActionResult<List<Retailer>>> UpdateRetailers([FromBody] List<RetailerUpdateDto> data)
        {
            return await Mediator.Send(new UpdateRetailersCommand { Data = data });
        }

        /// <summary>
        /// Add a new Retailer and create a user account for him
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost("retailer")]
        public async Task<ActionResult<Retailer>> CreateRetailer([FromBody] RetailerDto data)
        {
            return await Mediator.Send(new CreateRetailerCommand { Data = data });
        }

        /// <summary>
        /// Update a Retailer
        /// </summary>
        /// <returns></returns>
        [HttpPut("retailer/{externalRetailerCode}")]
        public async Task<ActionResult<Retailer>> UpdateRetailer(string externalRetailerCode, [FromBody] RetailerUpdateDto data)
        {
            return await Mediator.Send(new UpdateRetailerCommand { ExternalRetailerCode = externalRetailerCode, Data = data });
        }
    }
}
