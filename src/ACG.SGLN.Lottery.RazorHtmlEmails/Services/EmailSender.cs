using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Options;
using ACG.SGLN.Lottery.RazorHtmlEmails.Areas.Emails.Views;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.RazorHtmlEmails.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly EmailOptions _emailOptions;
        private readonly ITemplateToStringRenderer _templateToStringRenderer;

        public EmailSender(IOptions<EmailOptions> emailOptions, ITemplateToStringRenderer templateToStringRenderer)
        {
            _emailOptions = emailOptions.Value;
            _templateToStringRenderer = templateToStringRenderer;
        }

        public async Task SendEmailAsync<TModel>(string email, string subject, string template, TModel model, EmailAttachementFile emailAttachementFile = null)
        {
            await SendEmailAsync<TModel>(new List<string>() { email }, subject, template, model, emailAttachementFile);
        }


        public async Task SendEmailAsync<TModel>(List<string> emails, string subject, string template, TModel model, EmailAttachementFile emailAttachementFile = null)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailOptions.SenderName, _emailOptions.Sender));
                message.To.AddRange(emails.Select(e => MailboxAddress.Parse(e)));
                message.Subject = subject;

                var builder = new BodyBuilder();

                builder.HtmlBody = await _templateToStringRenderer.RenderTemplateToStringAsync($"/Areas/Emails/Views/Templates/{template}.cshtml",
                            new TemplateViewModel<TModel>()
                            {
                                Data = model
                            });

                if (emailAttachementFile != null)
                    builder.Attachments.Add(emailAttachementFile.FileName, emailAttachementFile.Data);

                message.Body = builder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    await client.ConnectAsync(_emailOptions.MailServer, _emailOptions.MailPort, _emailOptions.UseSSL);
                    await client.AuthenticateAsync(_emailOptions.Sender, _emailOptions.Password);

                    await client.SendAsync(message);

                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(ex.Message);
            }
        }

        public async Task SendEmailNotificationAsync<TModel>(List<string> emails, string subject, string template, TModel model)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailOptions.SenderName, _emailOptions.Sender));
                message.To.AddRange(emails.Select(e => MailboxAddress.Parse(e)));
                message.Subject = subject;

                var builder = new BodyBuilder();

                builder.HtmlBody = await _templateToStringRenderer.RenderTemplateToStringAsync($"/Areas/Emails/Views/Templates/{template}.cshtml",
                            new TemplateViewModel<TModel>()
                            {
                                Data = model
                            });

                message.Body = builder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    await client.ConnectAsync(_emailOptions.MailServer, _emailOptions.MailPort, _emailOptions.UseSSL);
                    await client.AuthenticateAsync(_emailOptions.Sender, _emailOptions.Password);

                    await client.SendAsync(message);

                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(ex.Message);
            }
        }

    }
}