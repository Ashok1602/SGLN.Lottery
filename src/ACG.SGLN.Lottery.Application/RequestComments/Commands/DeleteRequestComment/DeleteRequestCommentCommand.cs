using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using InvalidOperationException = ACG.SGLN.Lottery.Application.Common.Exceptions.InvalidOperationException;

namespace ACG.SGLN.Lottery.Application.RequestComments.Commands.DeleteRequestComment
{
    public class DeleteRequestCommentCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeleteRequestCommentCommandHandler : IRequestHandler<DeleteRequestCommentCommand, Unit>,
        IApplicationRequestHandler<DeleteRequestCommentCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly ICurrentUserService _currentUserService;

        public DeleteRequestCommentCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
        {
            _dbContext = dbContext;
            _currentUserService = currentUserService;

        }

        public async Task<Unit> Handle(DeleteRequestCommentCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<RequestComment>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(RequestComment), request.Id);

            if (entity.CreatedBy != _currentUserService.UserId)
                throw new InvalidOperationException("Seul l'utilisateur qu'a ajouté le commentaire qui peut le supprimer");

            entity.IsDeleted = true;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
