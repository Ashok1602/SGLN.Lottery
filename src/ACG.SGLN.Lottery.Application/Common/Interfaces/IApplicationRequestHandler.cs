using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Domain.Common;
using MediatR;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IApplicationRequestHandler<TRequest, out TResponse> where TRequest : IRequest<TResponse>
    {
        public void CheckEntityExists<T>(T entity) where T : class, IDeletableEntity
        {
            if (entity == null)
                throw new NotFoundException(typeof(T).Name);
        }
    }
}
