using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IExcelPrintService
    {
        Task<byte[]> GenerateExcel<TModel>(List<TModel> query, List<string> headings, string sheetName);
    }
}
