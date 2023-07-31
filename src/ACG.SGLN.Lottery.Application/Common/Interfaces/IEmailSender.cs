using ACG.SGLN.Lottery.Domain.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync<TModel>(string email, string subject, string template, TModel model, EmailAttachementFile emailAttachementFile = null);
        Task SendEmailAsync<TModel>(List<string> emails, string subject, string template, TModel model, EmailAttachementFile emailAttachementFile = null);
        Task SendEmailNotificationAsync<TModel>(List<string> emails, string subject, string template, TModel model);
    }
}
