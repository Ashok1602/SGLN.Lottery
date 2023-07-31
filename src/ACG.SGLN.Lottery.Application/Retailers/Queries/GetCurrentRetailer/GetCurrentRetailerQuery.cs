using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Queries
{
    public class GetCurrentRetailer : IRequest<RetailerDetailsDto>
    {
    }

    public class GetCurrentRetailerHandler : IRequestHandler<GetCurrentRetailer, RetailerDetailsDto>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly ICurrentUserService _currentUserService;
        protected readonly IIdentityService _identityService;
        protected readonly IMapper _mapper;

        public GetCurrentRetailerHandler(IApplicationDbContext context, ICurrentUserService currentUserService,
            IIdentityService identityService, IMapper mapper)
        {
            _context = context;
            _currentUserService = currentUserService;
            _identityService = identityService;
            _mapper = mapper;
        }

        public async Task<RetailerDetailsDto> Handle(GetCurrentRetailer request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Set<Retailer>()
                .Where(r => r.UserId == _currentUserService.UserId)
                .Include(r => r.Documents)
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Retailer), _currentUserService.UserId);


            var agent = await _identityService.GetUserByIdAsync(entity.AgentId);

            var res = _mapper.Map<RetailerDetailsDto>(entity);
            res.AgentEmail = agent?.Email;
            res.AgentFirstName = agent?.FirstName;
            res.AgentLastName = agent?.LastName;
            res.AgentPhoneNumber = agent?.PhoneNumber;
            res.AgentUserName = agent?.UserName;

            return res;
        }
    }
}