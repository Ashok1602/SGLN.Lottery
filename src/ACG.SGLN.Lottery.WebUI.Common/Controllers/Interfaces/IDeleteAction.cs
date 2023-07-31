using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Controllers.Interfaces
{
    public interface IDeleteAction<TId>
    {
        Task<ActionResult> Delete(TId id);
    }
}