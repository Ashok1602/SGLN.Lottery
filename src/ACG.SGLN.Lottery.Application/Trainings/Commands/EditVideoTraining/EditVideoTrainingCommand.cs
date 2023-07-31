using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.EditVideoTraining
{
    public class EditVideoTrainingCommand : IRequest<Training>
    {
        public Guid Id { get; set; }
        public VideoTrainingDto Data { get; set; }
    }

    public class EditVideoTrainingCommandHandler : IRequestHandler<EditVideoTrainingCommand, Training>,
        IApplicationRequestHandler<EditVideoTrainingCommand, Training>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public EditVideoTrainingCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Training> Handle(EditVideoTrainingCommand request, CancellationToken cancellationToken)
        {
            Training training = await _dbContext.Set<Training>().FindAsync(request.Id);

            if (training == null)
                throw new NotFoundException(nameof(Training), request.Id);

            if (!string.IsNullOrEmpty(request.Data.CourseURI))
                training.CourseURI = request.Data.CourseURI;

            if (!string.IsNullOrEmpty(request.Data.Title))
                training.Title = request.Data.Title;

            _dbContext.Entry(training).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return training;
        }
    }
}
