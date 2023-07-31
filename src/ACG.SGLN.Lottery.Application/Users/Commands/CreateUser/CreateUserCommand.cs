using ACG.SGLN.Lottery.Application.Commands;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Users.Commands.CreateUser
{
    public class CreateUserCommand : CreateDtoCommand<User, UserDto, string>
    {
    }

    public class CreateUserCommandHandler : CreateDtoCommandHandler<User, UserDto, string>,
        IApplicationRequestHandler<CreateUserCommand, User>
    {
        protected readonly IIdentityService _identityService;
        protected readonly IMapper _mapper;

        public CreateUserCommandHandler(IMapper mapper, IIdentityService identityService)
            : base(null, mapper)
        {
            _mapper = mapper;
            _identityService = identityService;
        }

        public override async Task<User> Handle(CreateDtoCommand<User, UserDto, string> request,
            CancellationToken cancellationToken)
        {
            var user = _mapper.Map<User>(request.Data);

            if (user.RoleName == AuthorizationConstants.Roles.Retailers)
                throw new InvalidOperationException("Impossible d'ajouter un utilisateur de type du profil Détaillant");

            //user.Id = Guid.NewGuid().ToString();
            return await _identityService.CreateUserAsync(user);
        }
    }

}