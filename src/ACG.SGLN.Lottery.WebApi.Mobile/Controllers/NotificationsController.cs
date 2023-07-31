using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Notifications.Commands.DeleteNotification;
using ACG.SGLN.Lottery.Application.Notifications.Queries.GetNotifications;
using ACG.SGLN.Lottery.Application.Notifications.Queries.GetStrippedNotifications;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
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
        /// Delete a Notification
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new DeleteNotificationCommand { Id = id });
        }
    }
}
