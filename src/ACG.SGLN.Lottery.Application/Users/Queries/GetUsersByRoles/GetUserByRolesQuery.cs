using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Queries.GetUsersByRoles
{
    public class GetUsersByRolesQuery : IRequest<List<User>>
    {
        public List<string> Roles { get; set; }
    }

    public class GetUsersByRoleQueryHandler : IRequestHandler<GetUsersByRolesQuery, List<User>>,
        IApplicationRequestHandler<GetUsersByRolesQuery, List<User>>
    {
        private readonly IIdentityService _identityService;
        public GetUsersByRoleQueryHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<List<User>> Handle(GetUsersByRolesQuery request, CancellationToken cancellationToken)
        {
            var userWithRoles = await _identityService.GetUserByRolesAsync(request.Roles);

            return userWithRoles.Where(u => u.IsDeactivated == false).ToList();
        }
    }
}
