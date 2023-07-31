using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.ExcellencePrograms.Queries.GetExcellenceProgram
{
    public class GetExcellenceProgramQuery : IRequest<ExcellenceProgramDto>
    {
    }

    public class GetExcellenceProgramQueryHandler : IRequestHandler<GetExcellenceProgramQuery, ExcellenceProgramDto>,
        IApplicationRequestHandler<GetExcellenceProgramQuery, ExcellenceProgramDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetExcellenceProgramQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<ExcellenceProgramDto> Handle(GetExcellenceProgramQuery request,
            CancellationToken cancellationToken)
        {
            var retailer = _context.Set<Retailer>().Where(r => r.UserId == _currentUserService.UserId).FirstOrDefault(); //test
            if (retailer == null)
                throw new NotFoundException(nameof(Retailer), _currentUserService.UserId);

            return new ExcellenceProgramDto() { CA = 900000, Classification = "Classe B", LoyaltyPoints = 485 };
        }


    }
}