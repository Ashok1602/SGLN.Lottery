using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Queries.GetUserByEmail
{
    public class GetUserByEmailQuery : IRequest<User>
    {
        public string Email { get; set; }
    }

    public class GetUserByEmailQueryHandler : IRequestHandler<GetUserByEmailQuery, User>, IApplicationRequestHandler<GetUserByEmailQuery, User>
    {
        private readonly IIdentityService _identityService;
        public GetUserByEmailQueryHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<User> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
        {
            return await _identityService.GetUserByEmailAsync(request.Email);
        }
    }
}
