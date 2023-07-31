using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Queries;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Queries.GetUsers
{
    public class GetUsersQuery : GetAllQuery<User, string>
    {
        public UserCriteria Criterea { get; set; } = new UserCriteria();
    }

    public class GetUsersQueryHandler : GetAllQueryHandler<User, string>,
        IApplicationRequestHandler<GetUsersQuery, PagedResult<User>>
    {
        private readonly IIdentityService _identityService;

        public GetUsersQueryHandler(IIdentityService context) : base(null)
        {
            _identityService = context;
        }

        public override async Task<PagedResult<User>> Handle(GetAllQuery<User, string> request, CancellationToken cancellationToken)
        {
            var req = ((GetUsersQuery)request);

            return await _identityService.GetUsersAsync(request.Page, request.Size, req.Criterea);
        }
    }
}