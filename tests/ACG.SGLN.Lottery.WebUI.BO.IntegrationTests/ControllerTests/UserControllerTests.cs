using ACG.SGLN.Lottery.Application.Users;
using ACG.SGLN.Lottery.Domain.Entities;
using FluentAssertions;
using System;
using System.Threading.Tasks;
using Xunit;

namespace ACG.SGLN.Lottery.WebUI.BO.IntegrationTests.ControllerTests
{
    public class UserControllerTests : BaseControllerTests<User, UserDto, UsersVm>
    {
        public UserControllerTests(CustomWebApplicationFactory<Startup> factory) : base(factory)
        {
        }

        [Fact(DisplayName = "Test User Listing Paginated")]
        public async Task ShouldGetPagedList()
        {
            int page = 1, size = 5;
            //[2] Getting User
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={page}&size={size}");
            httpResponse.EnsureSuccessStatusCode();

            //[2] List Users
            var pagedResult = await GetResponsePagedListContent(httpResponse);

            pagedResult.Results.Count.Should().Be(size);
            pagedResult.PageCount.Should().Be(3);
        }

        [Fact(DisplayName = "Test User get by Id")]
        public async Task ShouldGetUserById()
        {
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={1}&size={1}");
            httpResponse.EnsureSuccessStatusCode();

            var pagedResult = await GetResponsePagedListContent(httpResponse);
            var itemFromList = pagedResult.Results[0];
            var addedItem = await TryGetById(itemFromList.Id);

            addedItem.Should().NotBeNull();
            addedItem.UserName.Should().Be(itemFromList.UserName);
            addedItem.Email.Should().Be(itemFromList.Email);
        }


        [Fact(DisplayName = "Test Create User")]
        public async Task ShouldCreateUser()
        {
            var addNewItem = new UserDto
            {
                Email = "Customer" + new Random().Next(10, 99) + "@gmail.com",
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "1234567890",
                RoleName = "Customers"
            };

            //[1] create
            User newItem = await TryAdd(addNewItem);

            //[2] get by id
            var addedItem = await TryGetById(newItem.Id.ToString());
            addedItem.Should().NotBeNull();
            addedItem.Email.Should().Be(addNewItem.Email);
        }

        [Fact(DisplayName = "Test Update User")]
        public async Task ShouldUpdateUser()
        {
            //[1] create Vehicles Purchases
            await ShouldCreateUser();

            //[2] get by id
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={1}&size={1}");
            httpResponse.EnsureSuccessStatusCode();

            var pagedResult = await GetResponsePagedListContent(httpResponse);
            var itemFromList = pagedResult.Results[0];
            var addedItem = await TryGetById(itemFromList.Id);

            //[3] update
            UserDto userDto = new UserDto() { FirstName = "Test" + new Random().Next(10, 99) };
            await TryUpdate(addedItem.Id, userDto);

            //[2] get by id
            addedItem = await TryGetById(addedItem.Id.ToString());
            addedItem.Should().NotBeNull();
            addedItem.Email.Should().Be(addedItem.Email);
            addedItem.FirstName.Should().Be(userDto.FirstName);

        }

        [Fact(DisplayName = "Test Delete User")]
        public async Task ShouldDeleteUser()
        {
            //[1] create
            await ShouldCreateUser();

            //[2] get by id
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={1}&size={1}");
            httpResponse.EnsureSuccessStatusCode();

            var pagedResult = await GetResponsePagedListContent(httpResponse);
            var itemFromList = pagedResult.Results[0];
            var addedItem = await TryGetById(itemFromList.Id);

            //[5] delete
            await TryDelete(addedItem.Id);
            await TryGetById(addedItem.Id.ToString(), System.Net.HttpStatusCode.NotFound);
        }

        protected override string GetRequestUri()
        {
            return "/api/Users";
        }
    }
}