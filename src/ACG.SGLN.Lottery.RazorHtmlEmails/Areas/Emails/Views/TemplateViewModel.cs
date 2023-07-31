using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.RazorHtmlEmails.Areas.Emails.Views
{
    public class TemplateViewModel<T>
    {
        public User User { get; set; }
        public T Data { get; set; }
    }
}
