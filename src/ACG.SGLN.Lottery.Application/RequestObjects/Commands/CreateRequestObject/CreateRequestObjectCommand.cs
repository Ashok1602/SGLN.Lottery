using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestObjects.Commands.CreateRequestObject
{
    public class CreateRequestObjectCommand : IRequest<Unit>
    {
        public RequestObjectDto Data { get; set; }
    }

    public class CreateRequestObjectCommandHandler : IRequestHandler<CreateRequestObjectCommand, Unit>,
        IApplicationRequestHandler<CreateRequestObjectCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public CreateRequestObjectCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(CreateRequestObjectCommand request, CancellationToken cancellationToken)
        {
            RequestCategory requestCategory = await _dbContext.Set<RequestCategory>().FindAsync(request.Data.RequestCategoryId);
            if (requestCategory == null)
                throw new NotFoundException(nameof(RequestCategory), request.Data.RequestCategoryId);

            RequestObject requestObjEntity = _mapper.Map<RequestObject>(request.Data);
            requestObjEntity.RequestCategory = requestCategory;
            requestObjEntity.Type = DocumentType.RequestObjectCoverPicture;


            _dbContext.Set<RequestObject>().Add(requestObjEntity);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
