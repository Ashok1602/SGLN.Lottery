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

namespace ACG.SGLN.Lottery.Application.Requests.Queries.GetRequestById
{
    public class GetRequestByIdQuery : IRequest<Request>
    {
        public Guid Id { get; set; }
    }

    public class GetRequestByIdQueryHandler : IRequestHandler<GetRequestByIdQuery, Request>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;

        public GetRequestByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Request> Handle(GetRequestByIdQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Set<Request>()
                .Where(r => r.Id == request.Id)
                .Include(r => r.Retailer)
                .Include(r => r.Documents)
                .Include(r => r.RequestCategory)
                .Include(r => r.Comments)
                .Include(r => r.Statuses)
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Request), request.Id);

            entity.Statuses = entity.Statuses.OrderBy(s => s.Created).ToList();
            return entity;
        }
    }
}