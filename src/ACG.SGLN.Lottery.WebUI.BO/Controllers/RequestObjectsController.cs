using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.RequestObjects;
using ACG.SGLN.Lottery.Application.RequestObjects.Commands.CreateRequestObject;
using ACG.SGLN.Lottery.Application.RequestObjects.Commands.DeleteRequestObject;
using ACG.SGLN.Lottery.Application.RequestObjects.Commands.ToggleRequestObjectStatus;
using ACG.SGLN.Lottery.Application.RequestObjects.Commands.UpdateRequestObject;
using ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetRequestObjects;
using ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetStrippedRequestObjects;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.Domain.Enums;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// RequestObjects (for testing)
    /// </summary>
    public class RequestObjectsController : BaseController<RequestObject, Guid>
    {
        /// <summary>
        /// RequestObjects VM
        /// </summary>
        public class RequestObjectVm
        {
            public string Title { get; set; }
            public bool? IsExternal { get; set; }
            public Guid RequestCategoryId { get; set; }
            public IFormFile CoverImage { get; set; }
            public ProcessingDirectionType? ProcessingDirection { get; set; }
        }
        /// <summary>
        /// Create a RequestObject
        /// </summary>
        /// <param name="vm"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<Unit>> Create([FromForm] RequestObjectVm vm)
        {
            return await Mediator.Send(new CreateRequestObjectCommand
            {
                Data = new RequestObjectDto
                {
                    IsExternal = vm.IsExternal,
                    Title = vm.Title,
                    RequestCategoryId = vm.RequestCategoryId,
                    Data = await GetFileDataAsync(vm.CoverImage),
                    MimeType = "image/png",
                    ProcessingDirection = vm.ProcessingDirection
                }
            });
        }

        /// <summary>
        /// List all RequestObjects
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<PagedResult<RequestObject>>> Get(int? page, int? size, [FromQuery] RequestObjectCriterea requestObjectCriteria)
        {
            return await Mediator.Send(new GetRequestObjectsQuery { Page = page, Size = size, Criterea = requestObjectCriteria });
        }


        /// <summary>
        /// List all RequestObjects
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("{requestCategoryId}/stripped")]
        public async Task<ActionResult<List<IdValueDto<Guid>>>> GetStrippedByCategory(Guid requestCategoryId)
        {
            return await Mediator.Send(new GetStrippedRequestObjectsQuery { RequestCategoryId = requestCategoryId });
        }

        /// <summary>
        /// Update a RequestObject
        /// </summary>
        /// <param name="vm"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Update(Guid id, [FromForm] RequestObjectVm vm)
        {
            return await Mediator.Send(new UpdateRequestObjectCommand
            {
                Data = new RequestObjectDto
                {
                    IsExternal = vm.IsExternal,
                    Title = vm.Title,
                    RequestCategoryId = vm.RequestCategoryId,
                    Data = await GetFileDataAsync(vm.CoverImage),
                    MimeType = "image/png",
                    ProcessingDirection = vm.ProcessingDirection
                },
                Id = id
            });
        }

        /// <summary>
        /// Delete a RequestObject
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new DeleteRequestObjectCommand { Id = id });
        }

        private async Task<byte[]> GetFileDataAsync(IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    return stream.ToArray();
                }
            }
            return null;
        }

        /// <summary>
        /// Activates a RequestObject
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/activate")]
        public async Task<ActionResult<Unit>> Activate(Guid id)
        {
            return await Mediator.Send(new ToggleRequestObjectStatusCommand { Id = id, IsActive = true });
        }

        /// <summary>
        /// Deactivate a RequestObject
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/deactivate")]
        public async Task<ActionResult<Unit>> Deactivate(Guid id)
        {
            return await Mediator.Send(new ToggleRequestObjectStatusCommand { Id = id, IsActive = false });
        }
    }
}
