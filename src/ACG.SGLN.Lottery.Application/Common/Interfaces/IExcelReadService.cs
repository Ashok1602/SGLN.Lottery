using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IExcelReadService
    {
        List<TModel> ReadCSV<TModel>(byte[] data);
        List<TModel> ReadExcel<TModel>(byte[] data, int startColumn = 0, bool hasHeader = false);
    }
}
