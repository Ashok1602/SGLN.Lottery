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
    public class GetRetailerByIdQuery : IRequest<GetRetailerDto>
    {
        public Guid Id { get; set; }
    }

    public class GetRetailerByIdQueryHandler : IRequestHandler<GetRetailerByIdQuery, GetRetailerDto>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;
        private readonly IIdentityService _identityService;

        public GetRetailerByIdQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
        {
            _context = context;
            _mapper = mapper;
            _identityService = identityService;
        }

        public async Task<GetRetailerDto> Handle(GetRetailerByIdQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Set<Retailer>()
                .Where(r => r.Id == request.Id)
                .Include(r => r.Documents)
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Retailer), request.Id);

            var retailer = _mapper.Map<GetRetailerDto>(entity);

            if (!string.IsNullOrEmpty(entity.UserId))
            {
                var user = await _identityService.GetUserByIdAsync(entity.UserId);

                if (user != null)
                {
                    retailer.IsDeactivated = user.IsDeactivated;
                    retailer.IsValidated = user.IsValidated;
                    retailer.Email = user.Email;
                    retailer.Userid = user.Id;
                }
            }
            return retailer;
        }
    }
}