using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Services
{
    public interface IScopedProcessingService
    {
        Task DoWorkAsync(CancellationToken cancellationToken);
    }
}