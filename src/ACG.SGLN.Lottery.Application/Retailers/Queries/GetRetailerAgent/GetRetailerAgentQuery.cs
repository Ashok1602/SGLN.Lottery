using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Queries
{
    public class GetRetailerAgentQuery : IRequest<User>
    {
        public Guid? Id { get; set; }
    }

    public class GetRetailerAgentQueryHandler : IRequestHandler<GetRetailerAgentQuery, User>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;
        protected readonly IIdentityService _identityService;
        protected readonly ICurrentUserService _currentUserService;

        public GetRetailerAgentQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService, ICurrentUserService currentUserService)
        {
            _context = context;
            _mapper = mapper;
            _identityService = identityService;
            _currentUserService = currentUserService;
        }

        public async Task<User> Handle(GetRetailerAgentQuery request,
            CancellationToken cancellationToken)
        {

            var query = _context.Set<Retailer>().AsQueryable();

            if (request.Id.HasValue)
                query = query.Where(r => r.Id == request.Id.Value);
            else
                query.Where(r => r.UserId == _currentUserService.UserId);

            var agentId = await query
                .Select(r => r.AgentId)
                .FirstOrDefaultAsync();

            if (agentId == null)
                throw new NotFoundException(nameof(Retailer), request.Id);

            var agent = await _identityService.GetUserByIdAsync(agentId);

            return agent;
        }
    }
}