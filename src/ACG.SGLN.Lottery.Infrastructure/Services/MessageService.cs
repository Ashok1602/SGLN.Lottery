using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Options;
using MediatR;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Infrastructure.Services
{
    public class MessageService : IMessageService
    {
        private readonly MessagingOptions _MessagingOptions;
        public MessageService(IOptions<MessagingOptions> messagingOptions)
        {
            _MessagingOptions = messagingOptions.Value;
        }

        #region sms helper

        #region SendbyShortLink

        public void Initialize(HttpClient client)
        {
            client.DefaultRequestHeaders.Add("x-shortlink-apikey", _MessagingOptions.APIKey);
            client.DefaultRequestHeaders.Add("x-shortlink-apitoken", _MessagingOptions.APIToken);
            client.BaseAddress = new Uri(_MessagingOptions.BaseAddress);
        }

        public async Task<Unit> SendSmsByShortLink(List<string> to, string body)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    Initialize(client);

                    #region Constructing the request object

                    var request = new RequestDTO()
                    {
                        bulkId = Guid.NewGuid(),
                        messages = new List<MessageDTO>()
                        {
                            new MessageDTO()
                            {
                                from = "Blasti [No reply]",
                                validityPeriod = 2880, // this value is currently set to the maximun value (in mminutes)
                                content = body
                            }
                        }
                    };

                    //this is set for multiple messages to multiple receivers.
                    foreach (var message in request.messages)
                    {
                        foreach (var item in to)
                        {
                            message.to.Add(new ReceiverDTO()
                            {
                                phone = item
                            });
                        }
                    }

                    #endregion Constructing the request object

                    var serializeObject = JsonConvert.SerializeObject(request);
                    var stringContent = new StringContent(serializeObject);
                    stringContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                    var sendSmsResponse = await client.PostAsync("/api/v1/sms/send", stringContent);
                    var responseData = await sendSmsResponse.Content.ReadAsStringAsync();

                    return Unit.Value;
                }
            }
            catch
            {
                return Unit.Value;
            }
        }


        //Task<Unit> IMessageService.SendSmsByShortLink(List<string> to, string body)
        //{
        //    throw new System.NotImplementedException();
        //}

        #endregion SendbyShortLink

        #endregion sms helper

        #region DTOs

        /// <summary>
        /// declare Message DTO
        /// </summary>
        public class MessageDTO
        {
            public ICollection<ReceiverDTO> to { get; set; }

            public string from { get; set; }

            public string content { get; set; }

            public int validityPeriod { get; set; }

            public MessageDTO()
            {
                to = new List<ReceiverDTO>();
            }
        }

        /// <summary>
        /// declare Request DTO
        /// </summary>
        public class RequestDTO
        {
            public Guid bulkId { get; set; }

            public string notifyContentType { get; set; }

            public ICollection<MessageDTO> messages { get; set; }

            public RequestDTO()
            {
                notifyContentType = "application/json";
                messages = new List<MessageDTO>();
            }
        }

        /// <summary>
        /// declare Receiver DTO
        /// </summary>
        public class ReceiverDTO
        {
            public string phone { get; set; }
        }

        #endregion DTOs

    }
}
