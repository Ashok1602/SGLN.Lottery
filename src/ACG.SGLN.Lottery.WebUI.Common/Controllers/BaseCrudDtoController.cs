using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.WebUI.Common.Controllers.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Controllers
{
    [Authorize]
    public abstract class BaseCrudDtoController<TEntity, TDto, TId> : BaseDtoController<TEntity, TDto, TId>,
        IGetAction<TEntity, TId>,
        IGetByIdAction<TEntity, TId>,
        ICreateAction<TEntity, TDto, TId>,
        IUpdateAction<TEntity, TDto, TId>,
        IDeleteAction<TId>
        where TEntity : BaseEntity<TId>
        where TDto : class, IMapTo<TEntity>
    {
        [HttpPost]
        public Task<ActionResult<TEntity>> Create(TDto dto)
        {
            return DoCreate(dto);
        }

        [HttpGet]
        public Task<ActionResult<PagedResult<TEntity>>> Get(int? page, int? size)
        {
            return DoGet(page, size);
        }

        [HttpGet("{id}")]
        public Task<ActionResult<TEntity>> GetById(TId id)
        {
            return DoGetById(id);
        }

        [HttpPut("{id}")]
        public Task<ActionResult<Unit>> Update(TId id, TDto dto)
        {
            return DoUpdate(id, dto);
        }

        [HttpDelete("{id}")]
        public Task<ActionResult> Delete(TId id)
        {
            return DoDelete(id);
        }
    }
}