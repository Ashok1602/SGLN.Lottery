using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.TrainingModules;
using ACG.SGLN.Lottery.Application.TrainingModules.Commands.CreateTrainingModule;
using ACG.SGLN.Lottery.Application.TrainingModules.Commands.DeleteTrainingModule;
using ACG.SGLN.Lottery.Application.TrainingModules.Queries.GetStrippedTrainingModules;
using ACG.SGLN.Lottery.Application.TrainingModules.Queries.GetTrainingModuleById;
using ACG.SGLN.Lottery.Application.TrainingModules.Queries.GetTrainingModules;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.WebUI.Common.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// TrainingModules
    /// </summary>
    public class TrainingModulesController : BaseController<TrainingModule, Guid>
    {
        /// <summary>
        /// Create a TrainingModule
        /// </summary>
        /// <param name="title"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<Unit>> Create(string title)
        {
            return await Mediator.Send(new CreateTrainingModuleCommand { Title = title });
        }

        /// <summary>
        /// List all TrainingModules
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<List<TrainingModuleDTO>>> Get()
        {
            return await Mediator.Send(new GetTrainingModulesQuery());
        }


        /// <summary>
        /// List stripped TrainingModules
        /// </summary>
        /// <returns></returns>
        [HttpGet("stripped")]
        public async Task<ActionResult<List<IdValueDto<Guid>>>> GetStripped()
        {
            return await Mediator.Send(new GetStrippedTrainingModulesQuery { });
        }

        /// <summary>
        /// List TrainingModule by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<TrainingModule>> GetById(Guid id)
        {
            return await Mediator.Send(new GetTrainingModuleByIdQuery { Id = id });
        }

        /// <summary>
        /// Delete a TrainingModule
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new DeleteTrainingModuleCommand { Id = id });
        }

    }
}
