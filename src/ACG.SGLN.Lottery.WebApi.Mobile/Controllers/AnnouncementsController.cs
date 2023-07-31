using ACG.SGLN.Lottery.Application.Announcements.Queries.GetAnnouncementById;
using ACG.SGLN.Lottery.Application.Announcements.Queries.GetAnnouncements;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
{
    /// <summary>
    /// Announcements
    /// </summary>
    [Authorize]
    public class AnnouncementsController : ApiController
    {
        /// <summary>
        /// Get Announcements list
        /// </summary>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <param name="announcementCriteria"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<PagedResult<Announcement>>> Get(int? page, int? size,
            [FromQuery] AnnouncementCriterea announcementCriteria)
        {
            return await Mediator.Send(new GetAnnouncementsQuery
            {
                Page = page,
                Size = size,
                Criterea = new AnnouncementCriterea
                {
                    IsPublished = true
                }
            });
        }

        /// <summary>
        /// Get Announcement by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Announcement>> GetById(Guid id)
        {
            return await Mediator.Send(new GetAnnouncementByIdQuery { Id = id });
        }

    }
}