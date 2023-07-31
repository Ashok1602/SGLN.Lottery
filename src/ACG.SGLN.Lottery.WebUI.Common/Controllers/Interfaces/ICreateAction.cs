using ACG.SGLN.Lottery.Domain.Common;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Controllers.Interfaces
{
    public interface ICreateAction<TEntity, TDto, TId>
        where TEntity : BaseEntity<TId>
        where TDto : class
    {
        Task<ActionResult<TEntity>> Create(TDto dto);
    }
}