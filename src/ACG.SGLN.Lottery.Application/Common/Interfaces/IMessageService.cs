using MediatR;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IMessageService
    {
        Task<Unit> SendSmsByShortLink(List<string> to, string body);

    }
}
