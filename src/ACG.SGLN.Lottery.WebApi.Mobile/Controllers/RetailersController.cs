using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Notifications.Queries.GetNotifications;
using ACG.SGLN.Lottery.Application.Notifications.Queries.GetStrippedNotifications;
using ACG.SGLN.Lottery.Application.Retailers;
using ACG.SGLN.Lottery.Application.Retailers.Commands;
using ACG.SGLN.Lottery.Application.Retailers.Queries;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
{
    /// <summary>
    /// Retailers
    /// </summary>
    public class RetailersController : BaseDtoController<Retailer, RetailerDto, Guid>
    {
        /// <summary>
        /// Get Current Retailer
        /// </summary>
        /// <returns></returns>
        [HttpGet("current")]
        public async Task<ActionResult<RetailerDetailsDto>> GetCurrentRetailer()
        {
            return await Mediator.Send(new GetCurrentRetailer());
        }

        /// <summary>
        /// Get Retailer Agent 
        /// </summary>
        /// <returns></returns>
        [HttpGet("agent")]
        public async Task<ActionResult<User>> GetAgent()
        {
            return await Mediator.Send(new GetRetailerAgentQuery());
        }

        /// <summary>
        /// Activates notifications for a retailer
        /// </summary>
        /// <returns></returns>
        [HttpPost("notifications/activate")]
        public async Task<ActionResult<Unit>> ActivateNotification([FromBody] string deviceToken)
        {
            return await Mediator.Send(new ToggleNotifcationCommand { DeviceToken = deviceToken, IsNotified = true });
        }

        /// <summary>
        /// deactivates notifications for a retailer
        /// </summary>
        /// <returns></returns>
        [HttpPost("notifications/deactivate")]
        public async Task<ActionResult<Unit>> DeactivateNotification([FromBody] string deviceToken)
        {
            return await Mediator.Send(new ToggleNotifcationCommand { DeviceToken = deviceToken, IsNotified = false });
        }


        ///// <summary>
        ///// Update Retailer details
        ///// </summary>
        ///// <param name="id"></param>
        ///// <param name="dto"></param>
        ///// <returns></returns>
        //[HttpPut("{id}")]
        //public async Task<ActionResult<Unit>> Update(Guid id, [FromBody] RetailerDto dto)
        //{
        //    return await Mediator.Send(new UpdateRetailerCommand { Id = id, Data = dto });
        //}

        ///// <summary>
        ///// Create Retailer details
        ///// </summary>
        ///// <param name="dto"></param>
        ///// <returns></returns>
        //[HttpPost]
        //public async Task<ActionResult<Retailer>> Create([FromBody] RetailerDto dto)
        //{
        //    return await Mediator.Send(new CreateRetailerCommand { Data = dto });
        //}


        /// <summary>
        /// Get Retailer documents
        /// </summary>
        /// <param name="id"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpGet("{id}/documents")]
        public async Task<ActionResult<List<DocumentDto>>> GetDocuments(Guid id, [FromQuery] DocumentType? type)
        {
            return await Mediator.Send(new GetRetailerDocumentsQuery { RetailerId = id, Type = type });
        }

        /// <summary>
        /// Get Notifications from current retailer
        /// </summary>
        /// <returns></returns>
        [HttpGet("notifications")]
        public async Task<ActionResult<PagedResult<Notification>>> GetNotifications()
        {
            return await Mediator.Send(new GetNotificationsQuery());
        }

        /// <summary>
        /// Get Notifications from current retailer
        /// </summary>
        /// <returns></returns>
        [HttpGet("notifications/stripped")]
        public async Task<ActionResult<List<IdValueDto<Guid>>>> GetStrippedNotifications()
        {
            return await Mediator.Send(new GetStrippedNotificationsQuery());
        }

    }
}