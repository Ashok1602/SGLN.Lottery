using ACG.SGLN.Lottery.Application.ApplicationDocuments.Queries.GetApplicationDocuments;
using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.ApplicationDocuments.Queries
{
    public class ApplicationDocumentsSearchSpecification : BaseSpecification<ApplicationDocument>
    {
        public ApplicationDocumentsSearchSpecification(GetApplicationDocumentsQuery request)
        {
            //AddCriteria(t => t.Type == Domain.Enums.DocumentType.OfficialDocument || t.Type == Domain.Enums.DocumentType.OfficialRessource);

            if (!string.IsNullOrEmpty(request.Criterea.Title))
                AddCriteria(s => s.Title.Contains(request.Criterea.Title));

            if (request.Criterea.MaxCreationDate.HasValue)
                AddCriteria(s => s.Created.Date <= request.Criterea.MaxCreationDate.Value.Date);

            if (request.Criterea.MinCreationDate.HasValue)
                AddCriteria(s => s.Created.Date >= request.Criterea.MinCreationDate.Value.Date);

            if (request.Criterea.Type.HasValue)
                AddCriteria(s => s.Type == request.Criterea.Type.Value);
        }
    }
}