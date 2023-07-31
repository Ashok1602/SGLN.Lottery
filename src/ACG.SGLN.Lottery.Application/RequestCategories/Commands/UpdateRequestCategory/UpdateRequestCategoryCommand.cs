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

namespace ACG.SGLN.Lottery.Application.RequestCategorys.Commands.UpdateRequestCategory
{
    public class UpdateRequestCategoryCommand : IRequest<Unit>
    {
        public RequestCategoryDto Data { get; set; }
        public Guid Id { get; set; }
    }

    public class UpdateRequestCategoryCommandHandler : IRequestHandler<UpdateRequestCategoryCommand, Unit>,
        IApplicationRequestHandler<UpdateRequestCategoryCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public UpdateRequestCategoryCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateRequestCategoryCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<RequestCategory>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(RequestCategory), request.Id);

            if (!string.IsNullOrEmpty(request.Data.Title))
                entity.Title = request.Data.Title;

            entity.RequestNature = request.Data.RequestNature;

            if (request.Data.Data != null)
            {
                entity.MimeType = request.Data.MimeType;
                entity.Data = request.Data.Data;
            }
            entity.Type = DocumentType.RequestCategoryCoverPicture;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
