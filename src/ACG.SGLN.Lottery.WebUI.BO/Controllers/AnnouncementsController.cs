using ACG.SGLN.Lottery.Application.Annoucements;
using ACG.SGLN.Lottery.Application.Announcements.Commands;
using ACG.SGLN.Lottery.Application.Announcements.Commands.TogglePublishStatus;
using ACG.SGLN.Lottery.Application.Announcements.Queries.GetAnnouncementById;
using ACG.SGLN.Lottery.Application.Announcements.Queries.GetAnnouncements;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class AnnoucementVm
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public IFormFile CoverImage { get; set; }
    }
    /// <summary>
    /// Announcements
    /// </summary>
    [Authorize]
    public class AnnouncementsController : ApiController
    {

        /// <summary>
        /// Create new request
        /// </summary>
        /// <param name="vm">request data</param>
        /// <returns>Created request object</returns>
        [HttpPost]
        public async Task<ActionResult<Request>> Create([FromForm] AnnoucementVm vm)
        {
            await Mediator.Send(new CreateAnnouncementCommand
            {
                Data = new AnnouncementDto()
                {
                    Title = vm.Title,
                    Body = vm.Body,
                    Data = await GetFileDataAsync(vm.CoverImage),
                    MimeType = "image/png",
                    Uri = vm.CoverImage.FileName
                }
            });

            return Ok();
        }

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
            return await Mediator.Send(new GetAnnouncementsQuery { Page = page, Size = size, Criterea = announcementCriteria });
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


        /// <summary>
        /// Delete Announcement by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new DeleteAnnouncementCommand { Id = id });
        }


        /// <summary>
        /// Publish Announcement 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/publish")]
        public async Task<ActionResult<Unit>> Publish(Guid id)
        {
            return await Mediator.Send(new TogglePublishStatusCommand { Id = id, IsPublished = true });
        }

        /// <summary>
        /// UnPublish Announcement 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/unpublish")]
        public async Task<ActionResult<Unit>> Unpublish(Guid id)
        {
            return await Mediator.Send(new TogglePublishStatusCommand { Id = id, IsPublished = false });
        }

        private async Task<byte[]> GetFileDataAsync(IFormFile file)
        {
            if (file.Length > 0)
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    return stream.ToArray();
                }
            }
            return null;
        }

    }
}