using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RefData.Queries
{
    public class GetApplicationDocumentsQuery : IRequest<List<DocumentDto>>
    {
        public DocumentType? Type { get; set; }
    }

    public class GetApplicationDocumentsQueryHandler : IRequestHandler<GetApplicationDocumentsQuery, List<DocumentDto>>,
        IApplicationRequestHandler<GetApplicationDocumentsQuery, List<DocumentDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetApplicationDocumentsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<List<DocumentDto>> Handle(GetApplicationDocumentsQuery request, CancellationToken cancellationToken)
        {
            IQueryable<ApplicationDocument> query = _context.Set<ApplicationDocument>();

            if (request.Type.HasValue)
                query = query.Where(d => d.Type == request.Type.Value);

            return await query.OrderByDescending(t => t.Created)
                .Select(e => new DocumentDto
                {
                    Id = e.Id.ToString(),
                    Created = e.Created,
                    Comment = e.Comment,
                    MimeType = e.MimeType,
                    Spec = e.Spec,
                    Type = e.Type
                })
                .ToListAsync();
        }
    }
}
