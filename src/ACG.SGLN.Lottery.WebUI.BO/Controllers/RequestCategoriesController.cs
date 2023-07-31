using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.RequestCategorys;
using ACG.SGLN.Lottery.Application.RequestCategorys.Commands.CreateRequestCategory;
using ACG.SGLN.Lottery.Application.RequestCategorys.Commands.DeleteRequestCategory;
using ACG.SGLN.Lottery.Application.RequestCategorys.Commands.ToggleRequestCategoryStatus;
using ACG.SGLN.Lottery.Application.RequestCategorys.Commands.UpdateRequestCategory;
using ACG.SGLN.Lottery.Application.RequestCategorys.Queries.GetStrippedRequestCategorys;
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
    /// RequestCategorys (for testing)
    /// </summary>
    public class RequestCategoriesController : BaseController<RequestCategory, Guid>
    {
        /// <summary>
        /// RequestCategorys VM
        /// </summary>
        public class RequestCategoryVm
        {
            public RequestNatureType RequestNature { get; set; }
            public string Title { get; set; }
            public IFormFile CoverImage { get; set; }
        }
        /// <summary>
        /// Create a RequestCategory
        /// </summary>
        /// <param name="vm"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<Unit>> Create([FromForm] RequestCategoryVm vm)
        {
            return await Mediator.Send(new CreateRequestCategoryCommand
            {
                Data = new RequestCategoryDto
                {
                    RequestNature = vm.RequestNature,
                    Title = vm.Title,
                    Data = await GetFileDataAsync(vm.CoverImage),
                    MimeType = "image/png"
                }
            });
        }

        /// <summary>
        /// List all RequestCategorys
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<PagedResult<RequestCategory>>> Get(int? page, int? size, [FromQuery] RequestCategoriesCriterea RequestCategoryCriteria)
        {
            return await Mediator.Send(new GetRequestCategoriesQuery { Page = page, Size = size, Criterea = RequestCategoryCriteria });
        }

        /// <summary>
        /// Update a RequestCategory
        /// </summary>
        /// <param name="vm"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut]
        public async Task<ActionResult<Unit>> Update([FromForm] RequestCategoryVm vm, Guid id)
        {
            return await Mediator.Send(new UpdateRequestCategoryCommand
            {
                Data = new RequestCategoryDto
                {
                    RequestNature = vm.RequestNature,
                    Title = vm.Title,
                    Data = await GetFileDataAsync(vm.CoverImage),
                    MimeType = "image/png"
                },
                Id = id
            });
        }

        /// <summary>
        /// Delete a RequestCategory
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new DeleteRequestCategoryCommand { Id = id });
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
        /// Activates a RequestCategory
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/activate")]
        public async Task<ActionResult<Unit>> Activate(Guid id)
        {
            return await Mediator.Send(new ToggleRequestCategoryStatusCommand { Id = id, IsActive = true });
        }

        /// <summary>
        /// Deactivate a RequestCategory
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/deactivate")]
        public async Task<ActionResult<Unit>> Deactivate(Guid id)
        {
            return await Mediator.Send(new ToggleRequestCategoryStatusCommand { Id = id, IsActive = false });
        }

        /// <summary>
        /// List all RequestObjects
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("stripped")]
        public async Task<ActionResult<List<IdValueDto<Guid>>>> GetStripped()
        {
            return await Mediator.Send(new GetStrippedRequestCategoriesQuery { IsPublished = true });
        }

        /// <summary>
        /// List all RequestObjects
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("{requestNature}/stripped")]
        public async Task<ActionResult<List<IdValueDto<Guid>>>> GetStrippedByNature(RequestNatureType requestNature)
        {
            return await Mediator.Send(new GetStrippedRequestCategoriesByNatureQuery { RequestNature = requestNature, IsPublished = true });
        }
    }
}
