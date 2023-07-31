using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Notifications;
using ACG.SGLN.Lottery.Application.Notifications.Commands.CreateNotification;
using ACG.SGLN.Lottery.Application.Notifications.Queries.GetNotificationById;
using ACG.SGLN.Lottery.Application.Notifications.Queries.GetNotifications;
using ACG.SGLN.Lottery.Application.Notifications.Queries.GetStrippedNotifications;
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
    /// Notifications (for testing)
    /// </summary>
    public class NotificationsController : BaseController<Notification, Guid>
    {

        /// <summary>
        /// List all Notifications
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<PagedResult<Notification>>> Get(int? page, int? size,
             [FromQuery] NotificationCriterea notificationCriteria)
        {
            return await Mediator.Send(new GetNotificationsQuery { Page = page, Size = size, Criterea = notificationCriteria });
        }

        /// <summary>
        /// Get Notification by id
        /// </summary>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Notification>> GetById(Guid id)
        {
            return await Mediator.Send(new GetNotificationByIdQuery { Id = id });
        }

        /// <summary>
        /// All Alerts
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("stripped")]
        public async Task<ActionResult<List<IdValueDto<Guid>>>> GetStrippedNotifications()
        {
            return await Mediator.Send(new GetStrippedNotificationsQuery());
        }


        /// <summary>
        /// Creates a Notification
        /// </summary>
        /// <returns></returns>
        [HttpPost("")]
        public async Task<ActionResult<Notification>> Create([FromBody] NotificationDto notificationDto)
        {
            return await Mediator.Send(new CreateNotificationCommand { Data = notificationDto });
        }
    }
}
