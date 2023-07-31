using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Trainings;
using ACG.SGLN.Lottery.Application.Trainings.Commands.CreateLiveTraining;
using ACG.SGLN.Lottery.Application.Trainings.Commands.CreateTraining;
using ACG.SGLN.Lottery.Application.Trainings.Commands.CreateVideoTraining;
using ACG.SGLN.Lottery.Application.Trainings.Commands.EditInteractiveTraining;
using ACG.SGLN.Lottery.Application.Trainings.Commands.EditLiveTraining;
using ACG.SGLN.Lottery.Application.Trainings.Commands.EditVideoTraining;
using ACG.SGLN.Lottery.Application.Trainings.Commands.PublishTraining;
using ACG.SGLN.Lottery.Application.Trainings.Queries.GetAllTrainings;
using ACG.SGLN.Lottery.Application.Trainings.Queries.GetTrainingById;
using ACG.SGLN.Lottery.Application.Trainings.Queries.GetTrainingQuestionsById;
using ACG.SGLN.Lottery.Application.Trainings.Queries.GetTrainingSlidesById;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
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
        public async Task<ActionResult<PagedResult<Training>>> Get(int? page, int? size,
            [FromQuery] TrainingCriterea trainingCriteria)
        {
            return await Mediator.Send(new GetTrainingsQuery { Page = page, Size = size, Criterea = trainingCriteria });
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
        /// Create live training
        /// </summary>
        /// <param name="liveTrainingDto"></param>
        /// <returns></returns>
        [HttpPost("live")]
        public async Task<ActionResult<Training>> CreateLiveTraining([FromForm] LiveTrainingDto liveTrainingDto)
        {
            FileUploadDto fileData = null;
            if (liveTrainingDto.SupportDocument != null)
                fileData = new FileUploadDto
                {
                    File = await GetFileDataAsync(liveTrainingDto.SupportDocument),
                    MimeType = "application/pdf",
                    Type = Domain.Enums.DocumentType.TrainingSupportFile,
                    FileName = liveTrainingDto.SupportDocument.FileName
                };

            return await Mediator.Send(new CreateLiveTrainingCommand { Data = liveTrainingDto, SupportDocument = fileData });
        }

        /// <summary>
        /// Edit live training
        /// </summary>
        /// <param name="id"></param>
        /// <param name="liveTrainingDto"></param>
        /// <returns></returns>
        [HttpPut("live/{id}")]
        public async Task<ActionResult<Training>> EditLiveTraining(Guid id, [FromForm] LiveTrainingDto liveTrainingDto)
        {
            FileUploadDto fileData = null;
            if (liveTrainingDto.SupportDocument != null)
                fileData = new FileUploadDto
                {
                    File = await GetFileDataAsync(liveTrainingDto.SupportDocument),
                    MimeType = "application/pdf",
                    Type = Domain.Enums.DocumentType.TrainingSupportFile,
                    FileName = liveTrainingDto.SupportDocument.FileName
                };

            return await Mediator.Send(new EditLiveTrainingCommand { Id = id, Data = liveTrainingDto, SupportDocument = fileData });
        }

        /// <summary>
        /// Edit Interactive training
        /// </summary>
        /// <param name="id"></param>
        /// <param name="interactiveTrainingDto"></param>
        /// <returns></returns>
        [HttpPut("interactive/{id}")]
        public async Task<ActionResult<Training>> EditInteractiveTraining(Guid id, [FromBody] InteractiveTrainingDto interactiveTrainingDto)
        {
            return await Mediator.Send(new EditInteractiveTrainingCommand { Id = id, Data = interactiveTrainingDto });
        }

        /// <summary>
        /// Create video training
        /// </summary>
        /// <param name="videoTrainingDto"></param>
        /// <returns></returns>
        [HttpPost("video")]
        public async Task<ActionResult<Training>> CreateVideoTraining([FromBody] VideoTrainingDto videoTrainingDto)
        {
            return await Mediator.Send(new CreateVideoTrainingCommand { Data = videoTrainingDto });
        }

        /// <summary>
        /// Edit video training
        /// </summary>
        /// <param name="id"></param>
        /// <param name="videoTrainingDto"></param>
        /// <returns></returns>
        [HttpPut("video/{id}")]
        public async Task<ActionResult<Training>> EditVideoTraining(Guid id, [FromBody] VideoTrainingDto videoTrainingDto)
        {
            return await Mediator.Send(new EditVideoTrainingCommand { Id = id, Data = videoTrainingDto });
        }

        /// <summary>
        /// Create interactive training
        /// </summary>
        /// <param name="interactiveTrainingDto"></param>
        /// <returns></returns>
        [HttpPost("interactive")]
        public async Task<ActionResult<Training>> CreateInteractiveTraining([FromBody] InteractiveTrainingDto interactiveTrainingDto)
        {
            return await Mediator.Send(new CreateInteractiveTrainingCommand { Data = interactiveTrainingDto });
        }


        /// <summary>
        /// Publish Training 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/publish")]
        public async Task<ActionResult<Unit>> Publish(Guid id)
        {
            return await Mediator.Send(new ToggleTrainingStatusCommand { Id = id, IsPublished = true });
        }

        /// <summary>
        /// UnPublish Training 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/unpublish")]
        public async Task<ActionResult<Unit>> Unpublish(Guid id)
        {
            return await Mediator.Send(new ToggleTrainingStatusCommand { Id = id, IsPublished = false });
        }

        private async Task<byte[]> GetFileDataAsync(IFormFile file)
        {
            if (file.Length > 0)
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    return stream.ToArray();
                }
            }
            return null;
        }
    }
}