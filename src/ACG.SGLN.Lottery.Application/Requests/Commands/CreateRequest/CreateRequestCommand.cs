using ACG.SGLN.Lottery.Application.Commands;
using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Notifications;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using InvalidOperationException = ACG.SGLN.Lottery.Application.Common.Exceptions.InvalidOperationException;

namespace ACG.SGLN.Lottery.Application.Requests.Commands
{
    public class CreateRequestCommand : IRequest<Request>
    {
        public RequestDto Data { get; set; }
        public List<FileUploadDto> FilesData { get; set; }
    }

    public class CreateRequestCommandHandler : IRequestHandler<CreateRequestCommand, Request>,
        IApplicationRequestHandler<CreateRequestCommand, Request>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;
        private readonly IEmailSender _emailSender;

        public CreateRequestCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService, IMapper mapper, IMediator mediator, IEmailSender emailSender)
        {
            _dbContext = dbContext;
            _currentUserService = currentUserService;
            _mapper = mapper;
            _mediator = mediator;
            _emailSender = emailSender;
        }

        public async Task<Request> Handle(CreateRequestCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Retailers))
                throw new InvalidOperationException("Seule un compte détaillant peut ajouter une demande");

            Request requestEntity = _mapper.Map<Request>(request.Data);

            Retailer retailer = _dbContext.Set<Retailer>()
                                        .Where(r => r.UserId == _currentUserService.UserId)
                                        .FirstOrDefault();
            if (retailer == null)
                throw new NotFoundException(nameof(Retailer), _currentUserService.UserId);

            RequestCategory reqCat = await _dbContext.RequestCategories.FindAsync(request.Data.RequestCategoryId);
            if (retailer == null)
                throw new NotFoundException(nameof(RequestCategory), request.Data.RequestCategoryId);

            requestEntity.RequestCategory = reqCat;

            RequestObject reqObject = await _dbContext.RequestObjects.FindAsync(request.Data.RequestObjectId);
            requestEntity.RequestObject = $"{reqObject.Id}|{reqObject.Title}";
            requestEntity.ProcessingDirection = reqObject.ProcessingDirection;

            if (reqObject.IsExternal.HasValue)
            {
                if (reqObject.IsExternal.Value)
                    requestEntity.RequestAssignedTo = RequestAffectationType.ExternalAgent;
                else
                    requestEntity.RequestAssignedTo = RequestAffectationType.InternalAgent;
            }
            else
                requestEntity.RequestAssignedTo = RequestAffectationType.None;


            requestEntity.LastStatus = RequestStatusType.Submitted;
            requestEntity.Statuses = new List<RequestStatus>
            {
                new RequestStatus{ StatusType = RequestStatusType.Submitted }
            };

            requestEntity.Retailer = retailer;
            requestEntity.Reference = ConfigurationConstants.GetRandomAlphaNumericReference(request.Data.RequestNature);

            _dbContext.Set<Request>().Add(requestEntity);

            if (request.FilesData.Count > 0)
                await UploadDocuments(requestEntity.Id, request.FilesData);

            await _dbContext.SaveChangesAsync(cancellationToken);

            try
            {
                MailNotificationDto dto = new MailNotificationDto { Body = $"Une demande ayant comme référence {requestEntity.Reference} du détaillant numéro {requestEntity.Retailer.InternalRetailerCode}, ayant comme objet {requestEntity.RequestObject.Split('|')[1]}, soumise le {requestEntity.Created.ToShortDateString()} a été crée." };
                List<string> emails = new List<string>();
                if (!string.IsNullOrEmpty(requestEntity.Retailer.SGLNCommercialMail))
                    emails.Add(requestEntity.Retailer.SGLNCommercialMail);
                if (!string.IsNullOrEmpty(requestEntity.Retailer.SISALCommercialMail))
                    emails.Add(requestEntity.Retailer.SISALCommercialMail);
                if (emails.Any())
                    await _emailSender.SendEmailNotificationAsync<MailNotificationDto>(emails, "", TemplatesNames.Emails.MailNotification, dto);
            }
            catch { }

            return requestEntity;
        }

        private async Task UploadDocuments(Guid requestId, List<FileUploadDto> filesData)
        {
            foreach (var fileData in filesData)
            {
                await _mediator.Send(new UploadCommand()
                {
                    Id = requestId,
                    Type = fileData.Type,
                    Spec = DocumentSpec.None,
                    MimeType = fileData.MimeType,
                    Data = fileData.File,
                    Uri = fileData.FileName
                });
            }
        }
    }
}
