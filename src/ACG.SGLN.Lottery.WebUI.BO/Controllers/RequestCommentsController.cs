using ACG.SGLN.Lottery.Application.RequestComments;
using ACG.SGLN.Lottery.Application.RequestComments.Commands.CreateRequestComment;
using ACG.SGLN.Lottery.Application.RequestComments.Commands.DeleteRequestComment;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using ACG.SGLN.Lottery.WebUI.Common.Controllers.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// RequestComments (for testing)
    /// </summary>
    public class RequestCommentsController : BaseController<RequestComment, Guid>,
        ICreateAction<RequestComment, RequestCommentDto, Guid>
    {

        /// <summary>
        /// Create a RequestComment
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<RequestComment>> Create([FromBody] RequestCommentDto entity)
        {
            return await Mediator.Send(new CreateRequestCommentCommand { Data = entity });
        }

        /// <summary>
        /// Delete a RequestComment
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new DeleteRequestCommentCommand { Id = id });
        }
    }
}
