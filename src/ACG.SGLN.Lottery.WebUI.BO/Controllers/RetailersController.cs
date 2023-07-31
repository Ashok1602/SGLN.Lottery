using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Requests.Queries.GetRequestCommentsById;
using ACG.SGLN.Lottery.Application.Retailers;
using ACG.SGLN.Lottery.Application.Retailers.Commands;
using ACG.SGLN.Lottery.Application.Retailers.Queries;
using ACG.SGLN.Lottery.Application.Retailers.Queries.GetMunicipalities;
using ACG.SGLN.Lottery.Application.Retailers.Queries.GetRetailers;
using ACG.SGLN.Lottery.Application.Retailers.Queries.GetStrippedRetailers;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// Retailers
    /// </summary>
    [Authorize]
    public class RetailersController : ApiController
    {
        /// <summary>
        /// file VM
        /// </summary>
        public class ExcelFileVm
        {
            public IFormFile ExcelFile { get; set; }
        }
        /// <summary>
        /// Get retailers list
        /// </summary>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <param name="retailerCriteria"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<PagedResult<Retailer>>> Get(int? page, int? size,
            [FromQuery] RetailerCriterea retailerCriteria)
        {
            return await Mediator.Send(new GetRetailersQuery { Page = page, Size = size, Criterea = retailerCriteria });
        }

        /// <summary>
        /// Get Retailers From excel file
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("fromfile")]
        public async Task<ActionResult<Unit>> GetFromFile()
        {
            string Files = $"wwwroot/FilesImport/Retailers.xlsx";
            byte[] fileBytes = System.IO.File.ReadAllBytes(Files);

            return await Mediator.Send(new GetRetailersFromFileQuery { FileData = fileBytes });
        }


        /// <summary>
        /// Get Retailer by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<GetRetailerDto>> GetById(Guid id)
        {
            return await Mediator.Send(new GetRetailerByIdQuery { Id = id });
        }

        /// <summary>
        /// Get Retailer Agent 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}/agent")]
        public async Task<ActionResult<User>> GetAgent(Guid id)
        {
            return await Mediator.Send(new GetRetailerAgentQuery { Id = id });
        }

        /// <summary>
        /// Sets Retailer Agent 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="agentId"></param>
        /// <returns></returns>
        [HttpPost("{id}/agent")]
        public async Task<ActionResult<Unit>> AssignAgent(Guid id, [FromBody] string agentId)
        {
            return await Mediator.Send(new AssignAgentCommand { RetailerId = id, AgentId = agentId });
        }

        /// <summary>
        /// Sets Retailer Sales Representative 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="salesRepresentativedto"></param>
        /// <returns></returns>
        [HttpPost("{id}/salesRepresentative")]
        public async Task<ActionResult<Unit>> AssignSalesRepresentative(Guid id, [FromBody] SalesRepresentativeDto salesRepresentativedto)
        {
            return await Mediator.Send(new AssignSalesRepresentativeCommand { RetailerId = id, Data = salesRepresentativedto });
        }

        /// <summary>
        /// Sets mass Retailer Sales Representative 
        /// </summary>
        /// <param name="salesRepresentativedto"></param>
        /// <returns></returns>
        [HttpPost("mass/salesRepresentative")]
        public async Task<ActionResult<Unit>> MassAssignSalesRepresentative([FromBody] SalesRepresentativeDto salesRepresentativedto)
        {
            return await Mediator.Send(new AssignSalesRepresentativeCommand { Data = salesRepresentativedto });
        }


        /// <summary>
        /// List Stripped Retailers
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpGet("stripped")]
        public async Task<ActionResult<List<IdValueDto<Guid>>>> GetStrippedRetailers([FromQuery] string filter)
        {
            return await Mediator.Send(new GetStrippedRetailersQuery { Filter = filter });
        }


        /// <summary>
        /// List Municipalities
        /// </summary>
        /// <returns></returns>
        [HttpGet("municipalities")]
        public async Task<ActionResult<List<string>>> GetMunicipalities()
        {
            return await Mediator.Send(new GetMunicipalitiesQuery { });
        }

    }
}