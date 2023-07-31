using ACG.SGLN.Lottery.Application.Trainings;
using ACG.SGLN.Lottery.Application.Trainings.Commands.CompleteTraining;
using ACG.SGLN.Lottery.Application.Trainings.Commands.FinishTraining;
using ACG.SGLN.Lottery.Application.Trainings.Commands.StartTraining;
using ACG.SGLN.Lottery.Application.Trainings.Queries.GetAllTrainings;
using ACG.SGLN.Lottery.Application.Trainings.Queries.GetTrainingById;
using ACG.SGLN.Lottery.Application.Trainings.Queries.GetTrainingQuestionsById;
using ACG.SGLN.Lottery.Application.Trainings.Queries.GetTrainingSlidesById;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
{
    /// <summary>
    /// Trainings
    /// </summary>
    [Authorize]
    public class TrainingsController : ApiController
    {
        /// <summary>
        /// Get Trainings list
        /// </summary>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <param name="trainingCriteria"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<List<TrainingVm>>> Get(int? page, int? size,
            [FromQuery] RetailerTrainingCriterea trainingCriteria)
        {
            return await Mediator.Send(new GetRetailerTrainingsQuery { Page = page, Size = size, Criterea = trainingCriteria, IsPublished = true });
        }

        /// <summary>
        /// Get Training by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Training>> GetById(Guid id)
        {
            return await Mediator.Send(new GetTrainingByIdQuery { Id = id });
        }

        /// <summary>
        /// Get Training by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}/questions")]
        public async Task<ActionResult<List<TrainingQuestion>>> GetTrainingQuestionsById(Guid id)
        {
            return await Mediator.Send(new GetTrainingQuestionsByIdQuery { Id = id });
        }

        /// <summary>
        /// Get Training slides by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}/slides")]
        public async Task<ActionResult<InteractiveTrainingDocumentVm>> GetTrainingSlidesById(Guid id)
        {
            return await Mediator.Send(new GetTrainingSlidesByIdQuery { Id = id });
        }

        /// <summary>
        /// Start Training 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/course/start")]
        public async Task<ActionResult<Unit>> Start(Guid id)
        {
            return await Mediator.Send(new StartTrainingCommand { TrainingId = id });
        }

        /// <summary>
        /// Finish Training 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/course/finish")]
        public async Task<ActionResult<Unit>> Finish(Guid id)
        {
            return await Mediator.Send(new FinishTrainingCommand { TrainingId = id });
        }

        /// <summary>
        /// Finish Test 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="optionIDs"></param>
        /// <returns></returns>
        [HttpPost("{id}/test/finish")]
        public async Task<ActionResult<CompleteTrainingVm>> Complete(Guid id, [FromBody] List<Guid> optionIDs)
        {
            return await Mediator.Send(new CompleteTrainingCommand { TrainingId = id, SelectedOptionIDs = optionIDs });
        }
    }
}