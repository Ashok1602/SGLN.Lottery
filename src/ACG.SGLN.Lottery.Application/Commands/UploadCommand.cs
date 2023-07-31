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
    public class UploadCommand : IRequest<DocumentDto>
    {
        public Guid Id { get; set; }
        public DocumentType Type { get; set; }
        public DocumentSpec Spec { get; set; }
        public string MimeType { get; set; }
        public string Uri { get; set; }
        public byte[] Data { get; set; }
    }

    public class UploadCommandHandler : IRequestHandler<UploadCommand, DocumentDto>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IMediaService _mediaService;

        public UploadCommandHandler(IApplicationDbContext dbContext, IMapper mapper, IMediaService mediaService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _mediaService = mediaService;
        }

        public async Task<DocumentDto> Handle(UploadCommand request, CancellationToken cancellationToken)
        {
            AbstractDocument document = null;
            switch (request.Type)
            {
                case DocumentType.OfficialDocument:
                case DocumentType.OfficialRessource:
                case DocumentType.ToolboxDocument:
                case DocumentType.MediaLibraryDocument:
                    document = await CreateApplicationDocument(request);
                    break;
                case DocumentType.RequestAudioDocument:
                case DocumentType.RequestImageDocument:
                case DocumentType.RequestPdfDocument:
                    document = await CreateRequestDocument(request);
                    break;
                default:
                    throw new InvalidOperationException();
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            return new DocumentDto()
            {
                Id = document.Id.ToString(),
                Type = document.Type,
                Spec = document.Spec,
                MimeType = document.MimeType
            };
        }

        private async Task<AbstractDocument> CreateApplicationDocument(UploadCommand request)
        {
            ApplicationDocument document = new ApplicationDocument()
            {
                Type = request.Type,
                Title = request.Uri,
                Spec = request.Spec,
                MimeType = request.MimeType,
                Uri = request.Uri,
                Data = request.Data,
                IsGenerated = false
            };
            await _dbContext.Set<ApplicationDocument>().AddAsync(document);
            return document;
        }

        private async Task<AbstractDocument> CreateRequestDocument(UploadCommand request)
        {
            Request entity = await GetEntity<Request>(request.Id);
            RequestDocument document = new RequestDocument()
            {
                Type = request.Type,
                Spec = request.Spec,
                MimeType = request.MimeType,
                Uri = request.Uri,
                RequestId = entity.Id,
                Data = request.Data,
                IsGenerated = false
            };
            _dbContext.Set<RequestDocument>().Add(document);
            return document;
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