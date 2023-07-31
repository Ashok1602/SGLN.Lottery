
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

namespace ACG.SGLN.Lottery.Application.Retailers.Commands
{
    public class AssignSalesRepresentativeCommand : IRequest<Unit>
    {
        public Guid RetailerId { get; set; } = Guid.Empty;
        public SalesRepresentativeDto Data { get; set; }
    }

    public class AssignSalesRepresentativeCommandHandler : IRequestHandler<AssignSalesRepresentativeCommand, Unit>,
        IApplicationRequestHandler<AssignSalesRepresentativeCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;

        public AssignSalesRepresentativeCommandHandler(IApplicationDbContext dbContext, IIdentityService identityService, IMapper mapper)
        {
            _dbContext = dbContext;
            _identityService = identityService;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(AssignSalesRepresentativeCommand request, CancellationToken cancellationToken)
        {
            if (request.Data.IsMassAssignement || request.RetailerId == Guid.Empty)
            {

                var municipalityRetailers = _dbContext.Set<Retailer>().Where(x => x.Municipality.ToLower() == request.Data.TargetMunicipality.ToLower()).ToList();
                municipalityRetailers.ForEach(entity =>
                {
                    entity.SGLNCommercialName = request.Data.SGLNCommercialName;
                    entity.SGLNCommercialMail = request.Data.SGLNCommercialMail;
                    entity.SGLNCommercialPhone = request.Data.SGLNCommercialPhone;

                    entity.SISALCommercialName = request.Data.SISALCommercialName;
                    entity.SISALCommercialMail = request.Data.SISALCommercialMail;
                    entity.SISALCommercialPhone = request.Data.SISALCommercialPhone;

                    _dbContext.Entry(entity).State = EntityState.Modified;
                });
            }
            else
            {
                var entity = await _dbContext.Set<Retailer>().FindAsync(request.RetailerId);

                if (entity == null)
                    throw new NotFoundException(nameof(Retailer), request.RetailerId);

                entity.SGLNCommercialName = request.Data.SGLNCommercialName;
                entity.SGLNCommercialMail = request.Data.SGLNCommercialMail;
                entity.SGLNCommercialPhone = request.Data.SGLNCommercialPhone;

                entity.SISALCommercialName = request.Data.SISALCommercialName;
                entity.SISALCommercialMail = request.Data.SISALCommercialMail;
                entity.SISALCommercialPhone = request.Data.SISALCommercialPhone;

                _dbContext.Entry(entity).State = EntityState.Modified;
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
