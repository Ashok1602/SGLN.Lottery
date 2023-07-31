using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Commands.UpdateUser
{
    public class UpdateUserCommand : IRequest<User>
    {
        public string Id { get; set; }
        public UserUpdateDto Data { get; set; }
    }

    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, User>,
        IApplicationRequestHandler<UpdateUserCommand, User>
    {
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;

        public UpdateUserCommandHandler(IIdentityService identityService, IMapper mapper)
        {
            _identityService = identityService;
            _mapper = mapper;
        }

        public async Task<User> Handle(UpdateUserCommand request,
            CancellationToken cancellationToken)
        {
            return await _identityService.UpdateUserAsync(request.Id, _mapper.Map<User>(request.Data));
        }
    }
}