using ACG.SGLN.Lottery.Application.Invoices.Commands.SynchronizationInvoices;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Services
{
    public class InvoicesCronJob : CronJobBase<InvoicesCronJob>
    {
        public InvoicesCronJob(ILogger<InvoicesCronJob> logger,
            IMediator mediator)
            : base(logger, mediator)
        {
        }

        public override async Task DoWorkAsync(CancellationToken cancellationToken)
        {
            try
            {
                await Mediator.Send(new SynchronizationInvoicesCommand { });
                loggerInvoicesCronJob.LogInformation("Synchronization Invoices from file successfull");
            }
            catch (System.Exception)
            {
                loggerInvoicesCronJob.LogWarning("Synchronization Invoices from file Failed");
            }
        }
    }
}