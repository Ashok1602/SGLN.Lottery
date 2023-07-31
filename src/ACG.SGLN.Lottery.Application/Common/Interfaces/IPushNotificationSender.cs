using ACG.SGLN.Lottery.Domain.Enums;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IPushNotificationSender
    {
        Task SendMulticastPushNotificationAsync(string title, string body, NotificationType type);

        Task SendTargetedPushNotificationAsync(string title, string body, List<string> deviceToken);

        Task SubscribeToTopicAsync(string deviceToken, string topic);
        Task UnSubscribeFromTopicAsync(string deviceToken, string topic);
    }
}
