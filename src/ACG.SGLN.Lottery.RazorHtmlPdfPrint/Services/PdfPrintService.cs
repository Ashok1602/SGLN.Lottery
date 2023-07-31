using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Options;
using ACG.SGLN.Lottery.RazorHtmlPdfPrint.Views;
using iText.Html2pdf;
using iText.Kernel.Colors;
using iText.Kernel.Events;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Pdf.Xobject;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using Microsoft.Extensions.Options;
using QRCoder;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using Wkhtmltopdf.NetCore;
using Rectangle = iText.Kernel.Geom.Rectangle;

namespace ACG.SGLN.Lottery.RazorHtmlPdfPrint.Services
{
    public class PdfPrintService : IPdfPrintService
    {
        private readonly PrintFooterOptions _printFooterText;
        private readonly ITemplateToStringRenderer _templateToStringRenderer;
        private readonly IGeneratePdf _generatePdf;

        public PdfPrintService(IOptions<PrintFooterOptions> printFooterText, ITemplateToStringRenderer templateToStringRenderer, IGeneratePdf generatePdf)
        {
            _printFooterText = printFooterText.Value;
            _templateToStringRenderer = templateToStringRenderer;
            _generatePdf = generatePdf;
        }

        public async Task<byte[]> GeneratePdf<TModel>(string template, TModel model, bool isLandscape = false, bool isImageBased = false, bool useWkhtmltopdf = false)
        {
            var html = await _templateToStringRenderer.RenderTemplateToStringAsync($"/Areas/Reports/Views/Templates/{template}.cshtml",
                new PdfViewModel<TModel>()
                {
                    Data = model,
                    IsReport = isLandscape,
                    isImagebased = isImageBased
                });

            var workStream = new MemoryStream();

            if (useWkhtmltopdf)
            {
                if (isLandscape)
                {
                    _generatePdf.SetConvertOptions(new ConvertOptions()
                    {
                        PageOrientation = Wkhtmltopdf.NetCore.Options.Orientation.Landscape,
                        PageMargins = new Wkhtmltopdf.NetCore.Options.Margins(4, 4, 4, 4)
                    });
                }
                var pdf = _generatePdf.GetPDF(html);
                workStream.Write(pdf, 0, pdf.Length);
                workStream.Position = 0;
            }
            else
            {
                var converterProperties = new ConverterProperties();

                using (var pdfWriter = new PdfWriter(workStream))
                {
                    PdfDocument pdfDocument = new PdfDocument(pdfWriter);
                    if (isLandscape)
                        pdfDocument.SetDefaultPageSize(PageSize.A4.Rotate());
                    else if (!isImageBased)
                    {
                        pdfDocument.AddEventHandler(PdfDocumentEvent.END_PAGE, new Footer(_printFooterText));
                        pdfDocument.SetDefaultPageSize(PageSize.A4);
                    }
                    pdfWriter.SetCloseStream(false);

                    HtmlConverter.ConvertToPdf(html, pdfDocument, converterProperties);
                }
            }

            return workStream.ToArray();
        }


        public byte[] GenerateQRCode(string text)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);

            ImageConverter converter = new ImageConverter();

            return (byte[])converter.ConvertTo(qrCode.GetGraphic(8), typeof(byte[]));
        }
    }


    // Footer event handler
    public class Footer : IEventHandler
    {
        protected PdfFormXObject placeholder;
        protected float side = 20;
        protected float x = 300;
        protected float y = 20;
        protected float space = 4.5f;
        protected float descent = 3;
        private readonly PrintFooterOptions _printFooterText;

        public Footer(PrintFooterOptions printFooterText)
        {
            _printFooterText = printFooterText;
            placeholder = new PdfFormXObject(new Rectangle(0, 0, side, side));
        }
        public virtual void HandleEvent(Event @event)
        {
            PdfDocumentEvent docEvent = (PdfDocumentEvent)@event;
            PdfPage page = docEvent.GetPage();
            Rectangle pageSize = page.GetPageSize();

            // Creates drawing canvas
            PdfCanvas pdfCanvas = new PdfCanvas(page);
            Canvas canvas = new Canvas(pdfCanvas, pageSize);

            Style pStyle = new Style();
            pStyle.SetFontColor(ColorConstants.LIGHT_GRAY);
            pStyle.SetFontSize(8);
            Paragraph p = new Paragraph()
                .Add(_printFooterText.LineOne)
                .AddStyle(pStyle);
            Paragraph p2 = new Paragraph()
                .Add(_printFooterText.LineTwo)
                .AddStyle(pStyle); ;

            Style p2Style = new Style();
            p2Style.SetFontSize(8);
            p2Style.SetFontColor(new DeviceRgb(3, 120, 74));
            Paragraph p3 = new Paragraph()
                .Add(_printFooterText.LineThree)
                .AddStyle(p2Style);

            canvas.ShowTextAligned(p3, x, y, TextAlignment.CENTER);
            canvas.ShowTextAligned(p2, x, y + 15, TextAlignment.CENTER);
            canvas.ShowTextAligned(p, x, y + 30, TextAlignment.CENTER);
            canvas.Close();

            pdfCanvas.Release();
        }
    }
}
