namespace ACG.SGLN.Lottery.RazorHtmlPdfPrint.Views
{
    public class PdfViewModel<T>
    {
        public T Data { get; set; }
        public bool IsReport { get; set; } = false;
        public bool isImagebased { get; set; } = false;
    }
}
