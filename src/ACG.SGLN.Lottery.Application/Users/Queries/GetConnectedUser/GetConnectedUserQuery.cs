using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Queries.GetConnectedUser
{
    public class GetConnectedUserQuery : IRequest<User>
    {
    }

    public class GetConnectedUserQueryHandler : IRequestHandler<GetConnectedUserQuery, User>,
        IApplicationRequestHandler<GetConnectedUserQuery, User>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IIdentityService _identityService;

        public GetConnectedUserQueryHandler(IApplicationDbContext context, IMapper mapper,
            IIdentityService identityService, ICurrentUserService currentUserService)
        {
            _identityService = identityService;
            _currentUserService = currentUserService;
        }

        public async Task<User> Handle(GetConnectedUserQuery request, CancellationToken cancellationToken)
        {
            var entity = await _identityService.GetUserByIdAsync(_currentUserService.UserId);

            if (entity == null)
                throw new NotFoundException(nameof(User), _currentUserService.UserId);

            entity.Permissions = await _identityService.GetUserClaimesAsync(entity.Id, AuthorizationConstants.ClaimTypes.Permissions);

            return entity;
        }
    }
}