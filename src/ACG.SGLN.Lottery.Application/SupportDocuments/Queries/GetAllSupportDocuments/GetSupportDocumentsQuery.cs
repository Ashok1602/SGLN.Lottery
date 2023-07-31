using ACG.SGLN.Lottery.Application.Common.Extensions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Queries;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.ApplicationDocuments.Queries.GetApplicationDocuments
{
    public class GetApplicationDocumentsQuery : GetAllQuery<ApplicationDocument, Guid>
    {
        public ApplicationDocumentCriterea Criterea { get; set; } = new ApplicationDocumentCriterea();
    }

    public class GetApplicationDocumentsQueryHandler : GetAllQueryHandler<ApplicationDocument, Guid>,
        IApplicationRequestHandler<GetApplicationDocumentsQuery, PagedResult<ApplicationDocument>>
    {
        private readonly IApplicationDbContext _context;

        public GetApplicationDocumentsQueryHandler(IApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<PagedResult<ApplicationDocument>> Handle(GetAllQuery<ApplicationDocument, Guid> ApplicationDocument,
            CancellationToken cancellationToken)
        {
            var ApplicationDocumentQuery = _context.ApplySpecification
                (new ApplicationDocumentsSearchSpecification((GetApplicationDocumentsQuery)ApplicationDocument));

            return await ApplicationDocumentQuery
                .OrderByDescending(t => t.Created)
                .GetPaged(ApplicationDocument.Page.GetValueOrDefault(1),
                    ApplicationDocument.Size.GetValueOrDefault(CoreConstants.DefaultPageSize));
        }
    }
}