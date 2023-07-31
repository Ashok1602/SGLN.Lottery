using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using AutoMapper;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using InvalidOperationException = ACG.SGLN.Lottery.Application.Common.Exceptions.InvalidOperationException;

namespace ACG.SGLN.Lottery.Application.Commands
{
    public class DeleteDocumentCommand : IRequest
    {
        public Guid Id { get; set; }
        public DocumentType Type { get; set; }
    }

    public class DeleteDocumentCommandHandler : IRequestHandler<DeleteDocumentCommand>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public DeleteDocumentCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(DeleteDocumentCommand request, CancellationToken cancellationToken)
        {
            switch (request.Type)
            {
                case DocumentType.TrainingCertificate:
                    return await DeleteDocument<RetailerDocument>(request, cancellationToken);
                case DocumentType.RequestObjectCoverPicture:
                    return await DeleteDocument<RequestObject>(request, cancellationToken);
                case DocumentType.RequestCategoryCoverPicture:
                    return await DeleteDocument<RequestCategory>(request, cancellationToken);
                case DocumentType.AnnouncementCoverPicture:
                    return await DeleteDocument<Announcement>(request, cancellationToken);
                case DocumentType.TrainingCourseSlide:
                case DocumentType.TrainingCoverPicture:
                case DocumentType.TrainingSupportFile:
                    return await DeleteDocument<TrainingDocument>(request, cancellationToken);
                case DocumentType.RequestAudioDocument:
                case DocumentType.RequestImageDocument:
                case DocumentType.RequestPdfDocument:
                    return await DeleteDocument<RequestDocument>(request, cancellationToken);
                case DocumentType.OfficialDocument:
                case DocumentType.OfficialRessource:
                case DocumentType.MediaLibraryDocument:
                case DocumentType.ToolboxDocument:
                    return await DeleteDocument<ApplicationDocument>(request, cancellationToken);
                default:
                    throw new InvalidOperationException();
            }
        }

        private async Task<Unit> DeleteDocument<TDocument>(DeleteDocumentCommand request, CancellationToken cancellationToken)
            where TDocument : AbstractDocument
        {
            TDocument entity = await GetEntity<TDocument>(request.Id);
            _dbContext.Set<TDocument>().Remove(entity);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }

        private async Task<TEntity> GetEntity<TEntity>(Guid id)
            where TEntity : class, IDeletableEntity
        {
            var entity = await _dbContext.Set<TEntity>().FindAsync(id);

            if (entity == null)
                throw new NotFoundException(nameof(TEntity), id);

            return entity;
        }
    }
}