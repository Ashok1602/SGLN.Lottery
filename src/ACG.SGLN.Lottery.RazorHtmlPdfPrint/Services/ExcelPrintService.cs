using ACG.SGLN.Lottery.Application.Common.Interfaces;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.RazorHtmlPdfPrint.Services
{
    public class ExcelPrintService : IExcelPrintService
    {
        public async Task<byte[]> GenerateExcel<TModel>(List<TModel> query, List<string> headings, string sheetName)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (ExcelPackage pck = new ExcelPackage())
            {
                //Create the worksheet
                ExcelWorksheet ws = pck.Workbook.Worksheets.Add(sheetName);
                //get column headings
                for (int i = 0; i < headings.Count(); i++)
                {
                    ws.Cells[1, i + 1].Value = headings[i];
                }
                //populate  Data
                if (query.Count() > 0)
                {
                    ws.Cells["A2"].LoadFromCollection(query);
                }
                //Format the header
                using (ExcelRange rng = ws.Cells["A1:BZ1"])
                {
                    rng.Style.Font.Bold = true;
                    rng.Style.Fill.PatternType = ExcelFillStyle.Solid;                      //Set Pattern for the background to Solid
                    rng.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(0, 109, 49));  //Set color to dark blue
                    rng.Style.Font.Color.SetColor(Color.White);
                }

                //Write it back to the client
                return await pck.GetAsByteArrayAsync();
            }
        }
    }
}
