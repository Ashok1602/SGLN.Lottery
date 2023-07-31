using ACG.SGLN.Lottery.Domain.Entities;
using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace ACG.SGLN.Lottery.WebUI.BO.IntegrationTests.ControllerTests
{
    public class CitiesControllerTests : BaseControllerTests<City, City
        , List<City>>
    {
        public CitiesControllerTests(CustomWebApplicationFactory<Startup> factory) : base(factory)
        {
        }



        [Fact(DisplayName = "Test City CRUD (Create, Get by Id, Update, Delete)")]
        public async Task ShouldCreateCity()
        {
            var newItem = new City
            {
                Title = "Test" + new Random().Next(10, 99)
            };

            //[1] create
            newItem = await TryAdd(newItem);

            //[2] get by id
            var addedItem = await TryGetById(newItem.Id.ToString());
            addedItem.Should().NotBeNull();
            addedItem.Title.Should().Be(newItem.Title);

            //[3] update
            newItem.Title = "Test" + new Random().Next(10, 99);
            await TryUpdate(newItem.Id, newItem);

            //[4] get by id
            var updatedItem = await TryGetById(newItem.Id.ToString());
            updatedItem.Should().NotBeNull();
            updatedItem.Title.Should().Be(newItem.Title);

            //[5] delete
            await TryDelete(updatedItem.Id);
            await TryGetById(updatedItem.Id.ToString(), System.Net.HttpStatusCode.NotFound);

        }

        protected override string GetRequestUri()
        {
            return "/api/Cities";
        }
    }
}