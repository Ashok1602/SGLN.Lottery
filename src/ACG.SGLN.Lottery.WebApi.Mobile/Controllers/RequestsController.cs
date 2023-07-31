using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Requests;
using ACG.SGLN.Lottery.Application.Requests.Commands;
using ACG.SGLN.Lottery.Application.Requests.Commands.CancelRequest;
using ACG.SGLN.Lottery.Application.Requests.Commands.ContestRequest;
using ACG.SGLN.Lottery.Application.Requests.Queries.GetRequestById;
using ACG.SGLN.Lottery.Application.Requests.Queries.GetRequestCommentsById;
using ACG.SGLN.Lottery.Application.Requests.Queries.GetRequests;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class RequestVm
    {
        public RequestNatureType RequestNature { get; set; }
        public Guid RequestCategoryId { get; set; }
        public Guid RequestObjectId { get; set; }
        public string Description { get; set; }
        public string DocumentFileData { get; set; } //Base 64 Mob Team constraint
        public string DocumentFileName { get; set; }
        public string ImageFileData { get; set; }
        public string ImageFileName { get; set; }
        public string AudioFileData { get; set; }
        public string AudioFileName { get; set; }
    }
    /// <summary>
    /// Requests
    /// </summary>
    [Route("[controller]")]
    public class RequestsController : Controller
    {

        private IMediator _mediator;

        /// <summary>
        /// 
        /// </summary>
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();


        /// <summary>
        /// Get Requests list
        /// </summary>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <param name="requestCriteria"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<PagedResult<Request>>> Get(int? page, int? size,
            [FromQuery] RequestCriterea requestCriteria)
        {
            return await Mediator.Send(new GetRequestsQuery { Page = page, Size = size, Criterea = requestCriteria });
        }

        /// <summary>
        /// Get Request by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Request>> GetById(Guid id)
        {
            return await Mediator.Send(new GetRequestByIdQuery { Id = id });
        }

        /// <summary>
        /// Create new request
        /// </summary>
        /// <param name="vm">request data</param>
        /// <returns>Created request object</returns>
        [HttpPost]
        public async Task<ActionResult<Request>> Create([FromBody] RequestVm vm)
        {
            List<FileUploadDto> filesData = new List<FileUploadDto>();

            if (vm.AudioFileData != null)
                filesData.Add(new FileUploadDto
                {
                    File = Convert.FromBase64String(vm.AudioFileData),
                    MimeType = "audio/mpeg",
                    Type = DocumentType.RequestAudioDocument,
                    FileName = vm.AudioFileName
                });

            if (vm.DocumentFileData != null)
                filesData.Add(new FileUploadDto
                {
                    File = Convert.FromBase64String(vm.DocumentFileData),
                    MimeType = "application/pdf",
                    Type = DocumentType.RequestPdfDocument,
                    FileName = vm.DocumentFileName
                });

            if (vm.ImageFileData != null)
                filesData.Add(new FileUploadDto
                {
                    File = Convert.FromBase64String(vm.ImageFileData),
                    MimeType = "image/jpeg",
                    Type = DocumentType.RequestImageDocument,
                    FileName = vm.ImageFileName
                });

            var req = await Mediator.Send(new CreateRequestCommand
            {
                Data = new RequestDto()
                {
                    Description = vm.Description,
                    RequestCategoryId = vm.RequestCategoryId,
                    RequestNature = vm.RequestNature,
                    RequestObjectId = vm.RequestObjectId
                },
                FilesData = filesData
            });

            return Ok(req);
        }

        /// <summary>
        /// contest request by retailer
        /// </summary>
        /// <returns></returns>
        [HttpPost("{id}/contest")]
        public async Task<ActionResult<Unit>> Contest(Guid id, [FromBody] string reason)
        {
            return await Mediator.Send(new ContestRequestCommand { Id = id, Reason = reason });
        }

        /// <summary>
        /// Cancel request by retailer
        /// </summary>
        /// <returns></returns>
        [HttpPost("{id}/cancel")]
        public async Task<ActionResult<Unit>> Cancel(Guid id, [FromBody] string reason)
        {
            return await Mediator.Send(new CancelRequestCommand { Id = id, Reason = reason });
        }

        /// <summary>
        /// RequestComment by Id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet("{Id}/Comments")]
        public async Task<ActionResult<List<RequestComment>>> GetCommentsById(Guid Id)
        {
            return await Mediator.Send(new GetRequestCommentsByIdQuery { Id = Id });
        }

    }
}