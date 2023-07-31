using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.RazorHtmlPdfPrint.Services;
using Microsoft.Extensions.DependencyInjection;
using Wkhtmltopdf.NetCore;

namespace ACG.SGLN.Lottery.RazorHtmlPdfPrint
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRazorHtmlPdfPrint(this IServiceCollection services)
        {
            services.AddScoped<IPdfPrintService, PdfPrintService>();
            services.AddScoped<IExcelPrintService, ExcelPrintService>();
            services.AddScoped<IExcelReadService, ExcelReadService>();
            services.AddWkhtmltopdf();

            return services;
        }
    }
}