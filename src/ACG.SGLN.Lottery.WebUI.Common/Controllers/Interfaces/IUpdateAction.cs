using ACG.SGLN.Lottery.Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Controllers.Interfaces
{
    public interface IUpdateAction<TEntity, TDto, TId>
        where TEntity : BaseEntity<TId>
        where TDto : class
    {
        Task<ActionResult<Unit>> Update(TId id, TDto dto);
    }
}