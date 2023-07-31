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
    public abstract class BaseCrudController<TEntity, TId> : BaseController<TEntity, TId>,
        IGetAction<TEntity, TId>,
        IGetByIdAction<TEntity, TId>,
        ICreateAction<TEntity, TEntity, TId>,
        IUpdateAction<TEntity, TEntity, TId>,
        IDeleteAction<TId>
        where TEntity : BaseEntity<TId>
    {
        [HttpPost]
        public Task<ActionResult<TEntity>> Create(TEntity entity)
        {
            return DoCreate(entity);
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
        public async Task<ActionResult<Unit>> Update(TId id, TEntity entity)
        {
            return await DoUpdate(id, entity);
        }

        [HttpDelete("{id}")]
        public Task<ActionResult> Delete(TId id)
        {
            return DoDelete(id);
        }
    }
}