
using ACG.SGLN.Lottery.Application.Commands;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestComments.Commands.CreateRequestComment
{
    public class CreateRequestCommentCommand : CreateDtoCommand<RequestComment, RequestCommentDto, Guid>
    {
    }

    public class CreateRequestCommentCommandHandler : CreateDtoCommandHandler<RequestComment, RequestCommentDto, Guid>,
        IApplicationRequestHandler<CreateRequestCommentCommand, RequestComment>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;
        public CreateRequestCommentCommandHandler(IMapper mapper, IApplicationDbContext dbContext) :
            base(null, mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public override async Task<RequestComment> Handle(CreateDtoCommand<RequestComment, RequestCommentDto, Guid> request, CancellationToken cancellationToken)
        {

            var requestcomment = _mapper.Map<RequestComment>(request.Data);

            _dbContext.Set<RequestComment>().Add(requestcomment);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return requestcomment;
        }
    }
}
