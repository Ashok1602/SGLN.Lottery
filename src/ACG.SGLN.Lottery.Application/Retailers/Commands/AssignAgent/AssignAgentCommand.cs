
using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Commands
{
    public class AssignAgentCommand : IRequest<Unit>
    {
        public Guid RetailerId { get; set; }
        public string AgentId { get; set; }
    }

    public class AssignAgentCommandHandler : IRequestHandler<AssignAgentCommand, Unit>,
        IApplicationRequestHandler<AssignAgentCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;

        public AssignAgentCommandHandler(IApplicationDbContext dbContext, IIdentityService identityService, IMapper mapper)
        {
            _dbContext = dbContext;
            _identityService = identityService;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(AssignAgentCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<Retailer>().FindAsync(request.RetailerId);

            if (entity == null)
                throw new NotFoundException(nameof(Retailer), request.RetailerId);

            var agent = await _identityService.GetUserByIdAsync(request.AgentId);

            if (agent == null)
                throw new NotFoundException(nameof(User), request.AgentId);

            entity.AgentId = agent.Id;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
