using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface ITemplateToStringRenderer
    {
        Task<string> RenderTemplateToStringAsync<TModel>(string templateName, TModel model);
    }
}
