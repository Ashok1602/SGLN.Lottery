using ACG.SGLN.Lottery.Application.Commands;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Requests;
using ACG.SGLN.Lottery.Application.Requests.Commands.AssignRequest;
using ACG.SGLN.Lottery.Application.Requests.Commands.CloseRequest;
using ACG.SGLN.Lottery.Application.Requests.Commands.StartRequest;
using ACG.SGLN.Lottery.Application.Requests.Queries.GetRequestById;
using ACG.SGLN.Lottery.Application.Requests.Queries.GetRequestCommentsById;
using ACG.SGLN.Lottery.Application.Requests.Queries.GetRequests;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.Domain.Enums;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// Requests
    /// </summary>
    [Authorize]
    public class RequestsController : ApiController
    {
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
            return await Mediator.Send(new GetRequestsQuery { Page = page, Size = size, Criterea = requestCriteria, IsFromBo = true });
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
        /// assing request 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="isExternal"></param>
        /// <param name="processingDirection"></param>
        /// <returns></returns>
        [HttpPost("{id}/assign")]
        public async Task<ActionResult<Unit>> Assign(Guid id, [FromQuery] bool isExternal, [FromQuery] ProcessingDirectionType? processingDirection)
        {
            return await Mediator.Send(new AssignRequestCommand { RequestId = id, IsExternal = isExternal, ProcessingDirection = processingDirection });
        }


        /// <summary>
        /// Test
        /// </summary>
        /// <param name="emails"></param>
        /// <returns></returns>
        [HttpPost("mailTest")]
        [AllowAnonymous]
        public async Task<ActionResult<Unit>> TestMail([FromBody] List<string> emails)
        {
            return await Mediator.Send(new MailTestCommand { Emails = emails });
        }

        /// <summary>
        /// RequestComment by Id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet("{Id}/comments")]
        public async Task<ActionResult<List<RequestComment>>> GetCommentsById(Guid Id)
        {
            return await Mediator.Send(new GetRequestCommentsByIdQuery { Id = Id });
        }


        /// <summary>
        /// start request 
        /// </summary>
        /// <returns></returns>
        [HttpPost("{id}/start")]
        public async Task<ActionResult<Unit>> Start(Guid id)
        {
            return await Mediator.Send(new StartRequestCommand { Id = id });
        }

        /// <summary>
        /// close request 
        /// </summary>
        /// <returns></returns>
        [HttpPost("{id}/close")]
        public async Task<ActionResult<Unit>> Close(Guid id, [FromBody] CloseRequestDto closingDetail)
        {
            return await Mediator.Send(new CloseRequestCommand { Id = id, ClosingDetail = closingDetail });
        }


    }
}