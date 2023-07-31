using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Queries
{
    public class DownloadQuery : IRequest<AbstractDocument>
    {
        public Guid Id { get; set; }
        public DocumentType Type { get; set; }
        public bool IsThumbnail { get; set; } = false;
        public bool IsWebP { get; set; } = false;
    }


    public class DonwloadQueryHandler : IRequestHandler<DownloadQuery, AbstractDocument>
    {
        private readonly IApplicationDbContext _context;
        private readonly IStorage _storage;
        private readonly IMediaService _mediaService;

        public DonwloadQueryHandler(IApplicationDbContext context, IStorage storage, IMediaService mediaService)
        {
            _context = context;
            _storage = storage;
            _mediaService = mediaService;
        }

        public virtual async Task<AbstractDocument> Handle(DownloadQuery request, CancellationToken cancellationToken)
        {
            switch (request.Type)
            {
                case DocumentType.TrainingCertificate:
                    return await GetEntityDocument<RetailerDocument>(request);
                case DocumentType.RequestObjectCoverPicture:
                    return await GetEntityDocument<RequestObject>(request);
                case DocumentType.RequestCategoryCoverPicture:
                    return await GetEntityDocument<RequestCategory>(request);
                case DocumentType.AnnouncementCoverPicture:
                    return await GetEntityDocument<Announcement>(request);
                case DocumentType.TrainingCourseSlide:
                case DocumentType.TrainingCoverPicture:
                case DocumentType.TrainingSupportFile:
                    return await GetEntityDocument<TrainingDocument>(request);
                case DocumentType.RequestAudioDocument:
                case DocumentType.RequestImageDocument:
                case DocumentType.RequestPdfDocument:
                    return await GetDocument<Request, RequestDocument>(request);
                case DocumentType.OfficialDocument:
                case DocumentType.OfficialRessource:
                case DocumentType.MediaLibraryDocument:
                case DocumentType.ToolboxDocument:
                    return await GetEntityDocument<ApplicationDocument>(request);
                default:
                    return null;
            }
        }

        private async Task<AbstractDocument> GetEntityDocument<TDocument>(DownloadQuery request)
            where TDocument : AbstractDocument
        {
            AbstractDocument document = await _context.Set<TDocument>().FindAsync(request.Id);

            //if(document.Data == null)
            //    await GetFileData(request, document);

            return document;
        }

        private async Task<AbstractDocument> GetDocument<TEntity, TDocument>(DownloadQuery request)
            where TEntity : BaseEntity<Guid>, IHasDocuments<TDocument>
            where TDocument : AbstractDocument
        {
            AbstractDocument document = (await _context.Set<TDocument>().FindAsync(request.Id));
            if (document == null)
            {
                IHasDocuments<TDocument> entity = await _context.Set<TEntity>()
                    .Where(e => e.Id == request.Id)
                    .Include(e => e.Documents)
                    .OrderByDescending(e => e.Created)
                    .FirstOrDefaultAsync();

                document = entity?.Documents?.OrderBy(e => e.Uri).FirstOrDefault(e => e.Type == request.Type);
            }
            //await GetFileData(request, document);
            return document;
        }

        private async Task GetFileData(DownloadQuery request, AbstractDocument document)
        {
            if (document != null)
            {
                string docURI = document.Uri;
                if (!string.IsNullOrEmpty(document.Uri))
                {
                    if (request.IsThumbnail)
                    {
                        docURI += "_thumb";
                    }
                    if (request.IsWebP)
                    {
                        docURI += "_webp";
                    }
                    FileStream stream = (FileStream)(await _storage.GetFileAsync(document.Uri));
                    if (stream == null)
                    {
                        if (request.IsWebP)
                        {
                            stream = (FileStream)await _storage.GetFileAsync(docURI);
                            MemoryStream webPStream = (MemoryStream)_mediaService.GetThumbnail(stream);
                            await _storage.SaveFileAsync(webPStream, request.Type.ToString("G").ToLower(), docURI);
                            webPStream.Position = 0;
                            document.Data = webPStream.ToArray();
                        }
                        else
                        {
                            stream = (FileStream)await _storage.GetFileAsync(docURI);
                            MemoryStream thumbStream = (MemoryStream)_mediaService.GetThumbnail(stream);
                            await _storage.SaveFileAsync(thumbStream, request.Type.ToString("G").ToLower(), docURI);
                            thumbStream.Position = 0;
                            document.Data = thumbStream.ToArray();
                        }

                    }
                    else
                    {
                        if (stream != null)
                        {
                            stream.Position = 0;
                            document.Data = ReadFully(stream);
                        }
                    }
                }
            }
        }
        public static byte[] ReadFully(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }
    }
}