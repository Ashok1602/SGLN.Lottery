using ACG.SGLN.Lottery.Application.Commands;
using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Queries;
using ACG.SGLN.Lottery.Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Controllers
{
    [Authorize]
    public abstract class BaseDtoController<TEntity, TDto, TId> : ApiController
        where TEntity : BaseEntity<TId>
        where TDto : class, IMapTo<TEntity>
    {
        protected virtual async Task<ActionResult<PagedResult<TEntity>>> DoGet()
        {
            return await Mediator.Send(new GetAllDtoQuery<TEntity, TDto, TId> { });
        }

        protected virtual async Task<ActionResult<PagedResult<TEntity>>> DoGet(int? page, int? size)
        {
            return await Mediator.Send(new GetAllDtoQuery<TEntity, TDto, TId> { Page = page, Size = size });
        }

        protected virtual async Task<ActionResult<TEntity>> DoGetById(TId id)
        {
            return await Mediator.Send(new GetDtoByIdQuery<TEntity, TDto, TId> { Id = id });
        }

        protected virtual async Task<ActionResult<TEntity>> DoCreate(TDto dto)
        {
            return await Mediator.Send(new CreateDtoCommand<TEntity, TDto, TId> { Data = dto });
        }

        protected virtual async Task<ActionResult<Unit>> DoUpdate(TId id, TDto dto)
        {
            return await Mediator.Send(new UpdateDtoCommand<TEntity, TDto, TId> { Id = id, Data = dto });
        }

        protected virtual async Task<ActionResult> DoDelete(TId id)
        {
            await Mediator.Send(new DeleteCommand<TEntity, TId> { Id = id });

            return NoContent();
        }
    }
}