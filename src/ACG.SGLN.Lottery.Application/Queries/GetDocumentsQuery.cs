namespace ACG.SGLN.Lottery.Application.Vehicles.Queries.GetVehicleDocuments
{
    /*public abstract class GetDocumentsQuery<TEntity, TDocument> : IRequest<List<DocumentDto>>
        where TDocument: AbstractDocument
        where TEntity : BaseEntity<Guid>, IHasDocuments<TDocument>
    {
        public Guid Id { get; set; }
        public List<DocumentType> Types { get; set; } = new List<DocumentType>();
    }

    public class GetDocumentsQueryHander<TEntity, TDocument> : IRequestHandler<GetDocumentsQuery<TEntity, TDocument>, List<DocumentDto>>,
       IApplicationRequestHandler<GetVehicleDocumentsQuery, List<DocumentDto>>
        where TDocument : AbstractDocument
        where TEntity : BaseEntity<Guid>, IHasDocuments<TDocument>
    {
        private readonly IApplicationDbContext _context;

        public GetDocumentsQueryHander(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DocumentDto>> Handle(GetDocumentsQuery<TEntity, TDocument> request,
            CancellationToken cancellationToken)
        {
            var query = _context.Set<TEntity>().Where(t => t.Id == request.Id).AsQueryable();

            if (!request.Types?.Any() ?? false)
                query = query.Where(e => e.Documents.Any(d => request.Types.Contains(d.Type)));

            return await query.Include(e => e.Documents).SelectMany(e => e.Documents.Select(d => new DocumentDto()
            {
                Id = d.Id.ToString(),
                Type = d.Type,
                Spec = d.Spec,
                Status = d.Status,
                MimeType = d.MimeType,
                Created = d.Created,
                Validated = d.LastModified
            })).ToListAsync();


        }
    }*/
}
