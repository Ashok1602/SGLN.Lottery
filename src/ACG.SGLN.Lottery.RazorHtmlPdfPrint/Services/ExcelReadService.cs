using ACG.SGLN.Lottery.Application.Common.Interfaces;
using CsvHelper;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;

namespace ACG.SGLN.Lottery.RazorHtmlPdfPrint.Services
{
    public class ExcelReadService : IExcelReadService
    {
        public List<TModel> ReadExcel<TModel>(byte[] data, int startColumn = 0, bool hasHeader = false)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            List<TModel> result = new List<TModel>();
            using (MemoryStream ms = new MemoryStream(data))
            using (ExcelPackage package = new ExcelPackage(ms))
            {
                if (package.Workbook.Worksheets.Count == 0)
                    throw new InvalidOperationException("Your Excel file does not contain any work sheets");

                var worksheet = package.Workbook.Worksheets[0];
                int start = worksheet.Dimension.Start.Row + (hasHeader ? 1 : 0);

                for (int i = start; i <= worksheet.Dimension.End.Row; i++)
                {
                    int propCount = 1;
                    var obj = Activator.CreateInstance<TModel>();
                    foreach (PropertyInfo prop in obj.GetType().GetProperties())
                    {
                        prop.SetValue(obj, Convert.ChangeType(worksheet.Cells[i, propCount].Value.ToString(), prop.PropertyType), null);
                        //Convert.ChangeType(worksheet.Cells[i, propCount], prop.PropertyType)
                        propCount++;
                    }
                    result.Add(obj);
                    ////loop all columns in a row
                    //for (int j = worksheet.Dimension.Start.Column; j <= worksheet.Dimension.End.Column; j++)
                    //{
                    //    //add the cell data to the List 
                    //    if (worksheet.Cells[i, j].Value != null)
                    //    {
                    //        excelData.Add(worksheet.Cells[i, j].Value.ToString());
                    //    }
                    //}
                }
            }
            return result;
        }
        public List<TModel> ReadCSV<TModel>(byte[] data)
        {
            using (StreamReader reader = new StreamReader(new MemoryStream(data)))
            {
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                {
                    return csv.GetRecords<TModel>().ToList();
                }
            }
        }
    }
}