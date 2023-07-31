using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestObjects.Commands.UpdateRequestObject
{
    public class UpdateRequestObjectCommand : IRequest<Unit>
    {
        public RequestObjectDto Data { get; set; }
        public Guid Id { get; set; }
    }

    public class UpdateRequestObjectCommandHandler : IRequestHandler<UpdateRequestObjectCommand, Unit>,
        IApplicationRequestHandler<UpdateRequestObjectCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public UpdateRequestObjectCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateRequestObjectCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<RequestObject>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(RequestObject), request.Id);

            if (!string.IsNullOrEmpty(request.Data.Title))
                entity.Title = request.Data.Title;

            entity.RequestCategoryId = request.Data.RequestCategoryId;
            entity.IsExternal = request.Data.IsExternal;
            entity.ProcessingDirection = request.Data.ProcessingDirection;

            if (request.Data.Data != null)
            {
                entity.MimeType = request.Data.MimeType;
                entity.Data = request.Data.Data;
            }
            entity.Type = DocumentType.RequestObjectCoverPicture;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
