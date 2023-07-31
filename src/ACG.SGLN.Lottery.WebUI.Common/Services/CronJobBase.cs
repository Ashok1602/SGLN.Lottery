using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Services
{
    public abstract class CronJobBase<T> : IScopedProcessingService
    where T : CronJobBase<T>
    {

        protected CronJobBase(ILogger<IncentivesCronJob> logger, IMediator mediator)
        {
            LoggerIncentivesCronJob = logger;
            Mediator = mediator;
        }

        protected CronJobBase(ILogger<InvoicesCronJob> logger, IMediator mediator)
        {
            loggerInvoicesCronJob = logger;
            Mediator = mediator;
        }

        protected IMediator Mediator { get; }
        protected ILogger<IncentivesCronJob> LoggerIncentivesCronJob { get; }
        protected ILogger<InvoicesCronJob> loggerInvoicesCronJob;


        public abstract Task DoWorkAsync(CancellationToken cancellationToken);
    }
}