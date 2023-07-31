
using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Commands
{
    public class UpdateRetailerCommand : IRequest<Retailer>
    {
        public string ExternalRetailerCode { get; set; }
        public RetailerUpdateDto Data { get; set; }
    }

    public class UpdateRetailerCommandHandler : IRequestHandler<UpdateRetailerCommand, Retailer>,
        IApplicationRequestHandler<UpdateRetailerCommand, Retailer>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;

        public UpdateRetailerCommandHandler(IApplicationDbContext dbContext, IIdentityService identityService, IMapper mapper)
        {
            _dbContext = dbContext;
            _identityService = identityService;
            _mapper = mapper;
        }

        public async Task<Retailer> Handle(UpdateRetailerCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<Retailer>().Where(r => r.ExternalRetailerCode == request.ExternalRetailerCode).FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Retailer), request.ExternalRetailerCode);

            if (!string.IsNullOrEmpty(request.Data.FirstName))
                entity.FirstName = request.Data.FirstName;

            if (!string.IsNullOrEmpty(request.Data.LastName))
                entity.LastName = request.Data.LastName;

            if (!string.IsNullOrEmpty(request.Data.Phone))
                entity.Phone = request.Data.Phone;

            if (!string.IsNullOrEmpty(request.Data.Civility))
                entity.Civility = request.Data.Civility;

            if (!string.IsNullOrEmpty(request.Data.Address))
                entity.Address = request.Data.Address;

            if (!string.IsNullOrEmpty(request.Data.InternalRetailerCode))
                entity.InternalRetailerCode = request.Data.InternalRetailerCode;

            if (!string.IsNullOrEmpty(request.Data.ExternalRetailerCode))
                entity.ExternalRetailerCode = request.Data.ExternalRetailerCode;

            if (!string.IsNullOrEmpty(request.Data.ContractNumber))
                entity.ContractNumber = request.Data.ContractNumber;

            if (!string.IsNullOrEmpty(request.Data.Activity))
                entity.Activity = request.Data.Activity;

            if (!string.IsNullOrEmpty(request.Data.GeographicSector))
                entity.GeographicSector = request.Data.GeographicSector;

            if (!string.IsNullOrEmpty(request.Data.CompanyIdentifier))
                entity.CompanyIdentifier = request.Data.CompanyIdentifier;

            if (request.Data.AnnualCA.HasValue)
                entity.AnnualCA = request.Data.AnnualCA.Value;

            if (request.Data.WeeklySalesLimit.HasValue)
                entity.WeeklySalesLimit = request.Data.WeeklySalesLimit.Value;

            if (request.Data.TotalUnpaid.HasValue)
                entity.TotalUnpaid = request.Data.TotalUnpaid.Value;

            if (request.Data.TotalCommissions.HasValue)
                entity.TotalCommissions = request.Data.TotalCommissions.Value;

            if (request.Data.AdressLatitude.HasValue)
                entity.AdressLatitude = request.Data.AdressLatitude.Value;

            if (request.Data.AdressLongitude.HasValue)
                entity.AdressLongitude = request.Data.AdressLongitude.Value;


            if (!string.IsNullOrEmpty(request.Data.AgentEmail))
            {
                var agent = await _identityService.GetUserByEmailAsync(request.Data.AgentEmail);
                entity.AgentId = agent.Id;
            }

            await _identityService.UpdateUserAsync(entity.UserId, _mapper.Map<User>(request.Data));

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return entity;
        }
    }
}
