using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Queries
{
    public class GetRetailerDocumentsQuery : IRequest<List<DocumentDto>>
    {
        public Guid RetailerId { get; set; }
        public DocumentType? Type { get; set; }
    }

    public class GetRetailerDocumentsQueryHandler : IRequestHandler<GetRetailerDocumentsQuery, List<DocumentDto>>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;

        public GetRetailerDocumentsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<DocumentDto>> Handle(GetRetailerDocumentsQuery request,
            CancellationToken cancellationToken)
        {
            var docQuery = _context.Set<RetailerDocument>()
                .Where(r => r.RetailerId == request.RetailerId);

            if (request.Type.HasValue)
                docQuery = docQuery.Where(r => r.Type == request.Type.Value);

            return await docQuery.Select(d => new DocumentDto
            {
                Id = d.Id.ToString(),
                Comment = d.Comment,
                Created = d.Created,
                MimeType = d.MimeType,
                Spec = d.Spec,
                Type = d.Type,
            }).ToListAsync();

        }
    }
}