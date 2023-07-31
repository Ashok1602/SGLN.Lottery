using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Commands
{
    public class CreateRetailersCommand : IRequest<List<Retailer>>
    {
        public List<RetailerDto> Data { get; set; }
    }

    public class CreateRetailersCommandHandler : IRequestHandler<CreateRetailersCommand, List<Retailer>>,
        IApplicationRequestHandler<CreateRetailersCommand, List<Retailer>>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IIdentityService _identityService;

        public CreateRetailersCommandHandler(IApplicationDbContext dbContext, IMapper mapper, IIdentityService identityService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _identityService = identityService;
        }

        public async Task<List<Retailer>> Handle(CreateRetailersCommand request, CancellationToken cancellationToken)
        {
            List<Retailer> retailersAdded = new List<Retailer>();

            foreach (var ret in request.Data)
            {
                var retailer = _mapper.Map<Retailer>(request.Data);

                User res = await _identityService.CreateUserAsync(_mapper.Map<User>(request.Data));
                User retailerAgent = await _identityService.GetUserByEmailAsync(ret.AgentEmail); //will throw NotFoundException

                retailer.UserId = res.Id;
                retailer.AgentId = retailerAgent.Id;

                _dbContext.Set<Retailer>().Add(retailer);

                await _dbContext.SaveChangesAsync(cancellationToken);
                retailersAdded.Add(retailer);
            }
            return retailersAdded;
        }
    }
}
