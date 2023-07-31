using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Commands
{
    public class CreateRetailerCommand : IRequest<Retailer>
    {
        public RetailerDto Data { get; set; }
    }

    public class CreateRetailerCommandHandler : IRequestHandler<CreateRetailerCommand, Retailer>,
        IApplicationRequestHandler<CreateRetailerCommand, Retailer>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IIdentityService _identityService;

        public CreateRetailerCommandHandler(IApplicationDbContext dbContext, IMapper mapper, IIdentityService identityService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _identityService = identityService;
        }

        public async Task<Retailer> Handle(CreateRetailerCommand request, CancellationToken cancellationToken)
        {
            var retailer = _mapper.Map<Retailer>(request.Data);

            User res = await _identityService.CreateUserAsync(_mapper.Map<User>(request.Data));
            User retailerAgent = await _identityService.GetUserByEmailAsync(request.Data.AgentEmail); //will throw NotFoundException

            retailer.UserId = res.Id;
            retailer.AgentId = retailerAgent.Id;

            _dbContext.Set<Retailer>().Add(retailer);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return retailer;
        }
    }
}
