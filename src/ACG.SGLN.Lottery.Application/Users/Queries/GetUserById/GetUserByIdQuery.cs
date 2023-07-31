using ACG.SGLN.Lottery.Application.Common.Authorizations;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Queries;
using ACG.SGLN.Lottery.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Queries.GetUserById
{
    [AnonymousAccess]
    public class GetUserByIdQuery : GetByIdQuery<User, string>
    {
    }

    public class GetUserByIdQueryHandler : GetByIdQueryHandler<User, string>,
        IApplicationRequestHandler<GetUserByIdQuery, User>
    {
        private readonly IIdentityService _identityService;

        public GetUserByIdQueryHandler(IIdentityService identityService)
            : base(null, null)
        {
            _identityService = identityService;
        }

        public override async Task<User> Handle(GetByIdQuery<User, string> request, CancellationToken cancellationToken)
        {
            var entity = await _identityService.GetUserByIdAsync(request.Id);

            return entity;
        }
    }
}