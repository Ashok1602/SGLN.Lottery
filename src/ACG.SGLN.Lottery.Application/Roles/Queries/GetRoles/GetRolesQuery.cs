using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Users;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Roles.Queries.GetRoles
{
    public class GetRolesQuery : IRequest<List<RoleDto>>
    {
    }

    public class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, List<RoleDto>>,
        IApplicationRequestHandler<GetRolesQuery, List<RoleDto>>
    {
        private readonly IIdentityService _identityService;

        public GetRolesQueryHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<List<RoleDto>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
        {
            return await _identityService.GetRolesAsync();
        }
    }
}