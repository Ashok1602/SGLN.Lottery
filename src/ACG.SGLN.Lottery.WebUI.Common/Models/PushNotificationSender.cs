using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Enums;
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using System.Collections.Generic;
using System.Threading.Tasks;
using static ACG.SGLN.Lottery.Domain.Constants.ConfigurationConstants;

namespace ACG.SGLN.Lottery.WebUI.Common.Services
{
    public class PushNotificationSender : IPushNotificationSender
    {
        public async Task SendMulticastPushNotificationAsync(string title, string body, NotificationType type)
        {
            var messaging = FirebaseMessaging.GetMessaging(FirebaseApp.DefaultInstance);

            var message = new Message()
            {
                Topic = type == NotificationType.Alert ? Topics.All : Topics.Notified,
                Notification = new Notification()
                {
                    Body = body,
                    Title = title
                }
            };
            var msgId = await messaging.SendAsync(message);
        }

        public async Task SendTargetedPushNotificationAsync(string title, string body, List<string> deviceToken)
        {
            if (deviceToken.Count > 0)
            {
                var messaging = FirebaseMessaging.GetMessaging(FirebaseApp.DefaultInstance);
                var message = new MulticastMessage()
                {
                    Tokens = deviceToken,
                    Notification = new Notification()
                    {
                        Body = body,
                        Title = title
                    }
                };
                await messaging.SendMulticastAsync(message);
            }
        }

        public async Task SubscribeToTopicAsync(string deviceToken, string topic)
        {
            if (!string.IsNullOrEmpty(deviceToken))
                await FirebaseMessaging.DefaultInstance.SubscribeToTopicAsync(new List<string>() { deviceToken }, topic);
        }

        public async Task UnSubscribeFromTopicAsync(string deviceToken, string topic)
        {
            if (!string.IsNullOrEmpty(deviceToken))
                await FirebaseMessaging.DefaultInstance.UnsubscribeFromTopicAsync(new List<string>() { deviceToken }, topic);
        }
    }
}