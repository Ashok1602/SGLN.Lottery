using ACG.SGLN.Lottery.Application.Notifications.Commands.CreateNotification;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Services
{
    public class IncentivesCronJob : CronJobBase<IncentivesCronJob>
    {
        public IncentivesCronJob(ILogger<IncentivesCronJob> logger,
            IMediator mediator)
            : base(logger, mediator)
        {
        }

        public override async Task DoWorkAsync(CancellationToken cancellationToken)
        {
            try
            {
                await Mediator.Send(new PopulateIncentivesCommand { });
                LoggerIncentivesCronJob.LogInformation("Populating incentives from file successfull");
            }
            catch (System.Exception)
            {
                LoggerIncentivesCronJob.LogWarning("Populating incentives from file Failed");
            }
        }
    }
}