using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Requests.Queries.GetRequestCommentsById
{
    public class GetRequestCommentsByIdQuery : IRequest<List<RequestComment>>
    {
        public Guid Id { get; set; }
    }

    public class GetRequestCommentByIdQueryHandler : IRequestHandler<GetRequestCommentsByIdQuery, List<RequestComment>>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;

        public GetRequestCommentByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<RequestComment>> Handle(GetRequestCommentsByIdQuery request,
            CancellationToken cancellationToken)
        {
            return await _context.Set<RequestComment>()
                .Where(r => r.RequestId == request.Id)
                .ToListAsync();
        }
    }
}