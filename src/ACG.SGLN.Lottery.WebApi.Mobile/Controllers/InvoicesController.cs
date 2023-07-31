using ACG.SGLN.Lottery.Application.ExcellencePrograms.Queries.GetInvoices;
using ACG.SGLN.Lottery.Application.Invoices;
using ACG.SGLN.Lottery.Application.Invoices.Queries.GetLoyaltyPoints;
using ACG.SGLN.Lottery.Application.Invoices.Queries.GetStatusInvoice;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
{
    /// <summary>
    /// Invoices
    /// </summary>
    [Authorize]
    public class InvoicesController : ApiController
    {

        /// <summary>
        /// List Invoices By Date
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<List<InvoiceDto>>> GetByDate([FromQuery] InvoiceCriterea invoiceCriterea)
        {
            return await Mediator.Send(new GetInvoicesByDateQuery { Criterea = invoiceCriterea });
        }

        /// <summary>
        /// Get status invoices
        /// </summary>
        /// <returns></returns>
        [HttpGet("summary")]
        public async Task<ActionResult<StatusInvoiceDto>> GetInvoices()
        {
            return await Mediator.Send(new GetStatusInvoiceQuery { });
        }

        /// <summary>
        /// Get Loyalty Points 
        /// </summary>
        /// <returns></returns>
        [HttpGet("loyaltyPoints")]
        public async Task<ActionResult<LoyaltyPointsDto>> GetRetailerLoyaltyPoints()
        {
            return await Mediator.Send(new GetLoyaltyPointsQuery { });
        }

    }
}