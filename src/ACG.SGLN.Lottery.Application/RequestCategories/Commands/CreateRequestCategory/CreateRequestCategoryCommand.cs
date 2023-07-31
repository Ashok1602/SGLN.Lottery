using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestCategorys.Commands.CreateRequestCategory
{
    public class CreateRequestCategoryCommand : IRequest<Unit>
    {
        public RequestCategoryDto Data { get; set; }
    }

    public class CreateRequestCategoryCommandHandler : IRequestHandler<CreateRequestCategoryCommand, Unit>,
        IApplicationRequestHandler<CreateRequestCategoryCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public CreateRequestCategoryCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(CreateRequestCategoryCommand request, CancellationToken cancellationToken)
        {

            RequestCategory requestObjEntity = _mapper.Map<RequestCategory>(request.Data);
            requestObjEntity.Type = DocumentType.RequestCategoryCoverPicture;

            _dbContext.Set<RequestCategory>().Add(requestObjEntity);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
