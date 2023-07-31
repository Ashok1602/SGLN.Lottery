using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using ACG.SGLN.Lottery.Infrastructure.Identity.Entities;
using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Infrastructure.Persistence
{
    public static class ApplicationDbContextSeed
    {
        public static async Task SeedAll(IServiceProvider services, ApplicationDbContext dbContext)
        {
            #region seededDB
            //await SeedIdentityAsync(services, dbContext);

            //await SeedRetailerAsync(services, dbContext);
            ////await SeedRetailersDataAsync(services, dbContext);
            //await SeedUserAgentsAsync(services, dbContext);
            //await SeedRequestCategoriesAsync(services, dbContext);

            //await SeedRequestObjectAsync(services, dbContext);

            //await SeedRequestsAsync(services, dbContext);
            //await SeedAnnouncementsAsync(dbContext);
            //await CreateTrainingModuleAsync(dbContext);
            //await CreateTrainingsAsync(dbContext);
            //await SeedRequestCategoriesAndObjectAsync(dbContext);
            #endregion

            #region seedUtils
            //await ResetPasswordRetailersAsync(services, dbContext);
            //await AddOrRemoveClaimsAsync(services, dbContext, true); // Used to update claims while testing (for dev purpose only)
            //await SeedRoleClaimsAsync(services,dbContext);
            #endregion
        }

        public static async Task AddOrRemoveClaimsAsync(IServiceProvider services, ApplicationDbContext dbContext, bool add)
        {
            var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();

            var roleNames = new List<string> { AuthorizationConstants.Roles.PlatformManager };

            foreach (var roleName in roleNames)
            {
                var role = await roleManager.FindByNameAsync(roleName);

                List<string> newClaims = new List<string>
                {
                    AuthorizationConstants.Permissions.CanGetStrippedTrainingModules,
                    AuthorizationConstants.Permissions.CanGetStrippedNotifications,
                    AuthorizationConstants.Permissions.CanCreateRequestComment,
                    AuthorizationConstants.Permissions.CanDeleteRequestComment,
                    AuthorizationConstants.Permissions.CanGetRequestComments,
                    AuthorizationConstants.Permissions.CanCreateRequestObject,
                    AuthorizationConstants.Permissions.CanDeleteRequestObject,
                    AuthorizationConstants.Permissions.CanUpdateRequestObject,
                    AuthorizationConstants.Permissions.CanGetStrippedRequestObjects,
                    AuthorizationConstants.Permissions.CanGetRequestObjects,
                    AuthorizationConstants.Permissions.CanToggleRequestObjectStatus,
                    AuthorizationConstants.Permissions.CanCloseRequest,
                    AuthorizationConstants.Permissions.CanStartRequest,
                    AuthorizationConstants.Permissions.CanGetRequests,
                    AuthorizationConstants.Permissions.CanGetRequestById,
                    AuthorizationConstants.Permissions.CanGetRequestCommentsById,
                    AuthorizationConstants.Permissions.CanGetStrippedRetailers,
                    AuthorizationConstants.Permissions.CanChangeUserPassword,
                    AuthorizationConstants.Permissions.CanGetConnectedUser,
                    AuthorizationConstants.Permissions.CanGetStrippedRequestCategories ,
                    AuthorizationConstants.Permissions.CanGetStrippedRequestCategoriesByNature,
                    AuthorizationConstants.Permissions.CanAssignRequest
                };

                if (add)
                {
                    foreach (var claim in newClaims)
                    {
                        await roleManager.AddClaimAsync(role, new Claim(AuthorizationConstants.ClaimTypes.Permissions, claim));
                    }
                }
                else
                {
                    foreach (var claim in newClaims)
                    {
                        await roleManager.RemoveClaimAsync(role, new Claim(AuthorizationConstants.ClaimTypes.Permissions, claim));
                    }
                }

                await dbContext.SaveChangesAsync();
            }
        }



        public static async Task SeedRoleClaimsAsync(IServiceProvider services, ApplicationDbContext dbContext)
        {
            var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();

            foreach (var roleField in typeof(AuthorizationConstants.Roles).GetFields())
            {
                var roleName = (string)roleField.GetValue(null);
                var role = await roleManager.FindByNameAsync(roleName);
                var permissions = SeedData.RolePermissions.GetValueOrDefault(roleName);

                if (permissions != null)
                    foreach (var permission in permissions)
                        await roleManager.AddClaimAsync(role, new Claim(AuthorizationConstants.ClaimTypes.Permissions, permission));
            }
        }

        public static async Task SeedRetailerAsync(IServiceProvider services, ApplicationDbContext dbContext)
        {
            if (!dbContext.Retailers.Any())
            {
                var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                var agentsIds = dbContext.Users.Where(u => u.UserName.Contains("internalagent@sgln")).Select(a => a.Id).ToList();
                for (int index = 1; index < 10; index++)
                {
                    var appuser = CreateUserRetailerAsync(index, services, userManager).Result;
                    //var user = dbContext.Users.Where(u => u.Id == appuser.Id).FirstOrDefault();
                    var retailer = new Faker<Retailer>()
                            .RuleFor(v => v.Civility, f => "M.")
                            .RuleFor(v => v.FirstName, f => appuser.FirstName)
                            .RuleFor(v => v.LastName, f => appuser.LastName)
                            .RuleFor(v => v.Phone, f => appuser.PhoneNumber)
                            .RuleFor(v => v.Email, f => appuser.Email)
                            .RuleFor(v => v.Activity, f => f.Commerce.Locale)
                            .RuleFor(v => v.AdressLatitude, f => f.Address.Latitude())
                            .RuleFor(v => v.AdressLongitude, f => f.Address.Longitude())
                            .RuleFor(v => v.TotalCommissions, f => 10000)
                            .RuleFor(v => v.TotalUnpaid, f => 1000)
                            .RuleFor(v => v.WeeklySalesLimit, f => 10000)
                            .RuleFor(v => v.AnnualCA, f => 90000)
                            .RuleFor(v => v.CompanyIdentifier, f => f.Company.CompanySuffix())
                            .RuleFor(v => v.GeographicSector, f => f.Person.Address.State)
                            .RuleFor(v => v.UserId, f => appuser?.Id)
                            .RuleFor(v => v.AgentId, f => f.PickRandom<string>(agentsIds))
                            .RuleFor(v => v.City, f => f.PickRandom<string>(SeedData.Cities));
                    dbContext.Retailers.Add(retailer);
                }
                await dbContext.SaveChangesAsync();
            }
        }


        public static async Task SeedRequestsAsync(IServiceProvider services, ApplicationDbContext dbContext)
        {
            if (!dbContext.Requests.Any())
            {
                for (int i = 0; i < 20; i++)
                {
                    var retailer = dbContext.Retailers.FirstOrDefault();
                    var reqObj = dbContext.RequestObjects.FirstOrDefault();

                    var request = new Faker<Request>()
                     .RuleFor(v => v.Description, f => f.Person.UserName)
                     .RuleFor(v => v.RequestObject, f => $"{reqObj.Id}|{reqObj.Title}")
                     .RuleFor(v => v.RequestNature, RequestNatureType.Technical)
                     .RuleFor(v => v.LastStatus, f => f.PickRandom<RequestStatusType>())
                     .RuleFor(v => v.RetailerId, f => retailer.Id)
                     .RuleFor(v => v.RequestCategoryId, reqObj.RequestCategoryId)
                     .RuleFor(v => v.ClosingDescriptionMessage, f => f.Commerce.Locale)
                     .RuleFor(v => v.ClosingRetailerMessage, f => f.Company.CompanySuffix());
                    dbContext.Requests.Add(request);
                }
                await dbContext.SaveChangesAsync();
            }
        }


        public static async Task SeedAnnouncementsAsync(ApplicationDbContext dbContext)
        {
            if (!dbContext.Announcements.Any())
            {
                var placeHolder = File.ReadAllBytes("wwwroot/placeholder-generic.png");

                for (int i = 0; i < 35; i++)
                {
                    var announcement = new Faker<Announcement>()
                     .RuleFor(v => v.Title, f => f.Random.Words())
                     .RuleFor(v => v.Body, f => f.Lorem.Text())
                     .RuleFor(v => v.IsPublished, f => f.Random.Bool())
                     .RuleFor(v => v.Type, f => DocumentType.AnnouncementCoverPicture)
                     .RuleFor(v => v.Data, f => placeHolder)
                     .RuleFor(v => v.MimeType, f => "image/png");
                    dbContext.Announcements.Add(announcement);
                }
                await dbContext.SaveChangesAsync();
            }
        }

        public static async Task SeedRequestObjectAsync(IServiceProvider services, ApplicationDbContext dbContext)
        {
            if (!dbContext.RequestObjects.Any())
            {
                var requestCategories = dbContext.RequestCategories.Select(rc => rc.Id).ToList();
                var placeHolder = File.ReadAllBytes("wwwroot/placeholder-generic.png");
                for (int i = 0; i < 15; i++)
                {
                    var reqObject = new Faker<RequestObject>()
                       .RuleFor(v => v.IsExternal, f => f.Random.Bool())
                       .RuleFor(v => v.Title, f => f.Commerce.Department())
                       .RuleFor(v => v.RequestCategoryId, f => f.PickRandom<Guid>(requestCategories))
                       .RuleFor(v => v.Type, f => DocumentType.RequestObjectCoverPicture)
                       .RuleFor(v => v.Data, f => placeHolder)
                       .RuleFor(v => v.MimeType, f => "image/png");
                    dbContext.RequestObjects.Add(reqObject);
                }

                await dbContext.SaveChangesAsync();
            }
        }

        public static async Task SeedRequestCategoriesAsync(IServiceProvider services, ApplicationDbContext dbContext)
        {
            if (!dbContext.RequestCategories.Any())
            {
                var placeHolder = File.ReadAllBytes("wwwroot/placeholder-generic.png");
                for (int i = 0; i < 4; i++)
                {
                    var reqObject = new Faker<RequestCategory>()
                       .RuleFor(v => v.Title, f => f.Name.JobTitle())
                       .RuleFor(v => v.Type, f => DocumentType.RequestCategoryCoverPicture)
                       .RuleFor(v => v.Data, f => placeHolder)
                       .RuleFor(v => v.MimeType, f => "image/png");
                    dbContext.RequestCategories.Add(reqObject);
                }

                await dbContext.SaveChangesAsync();
            }
        }


        public static async Task ResetPasswordRetailersAsync(IServiceProvider services, ApplicationDbContext dbContext)
        {
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

            var users = dbContext.Users.Where(u => u.UserName.Contains("Detaillant")).ToList();

            if (users != null && users.Count > 0)
            {
                foreach (var user in users)
                {
                    var password = AuthorizationConstants.DefaultPassword;
                    await userManager.RemovePasswordAsync(user);
                    await userManager.AddPasswordAsync(user, password);
                    var result = await userManager.UpdateAsync(user);
                }
            }
        }

        public static async Task SeedRequestCategoriesAndObjectAsync(ApplicationDbContext dbContext)
        {
            if (!dbContext.RequestCategories.Any())
            {
                Dictionary<string, List<string>> RequestCategoriesAndObjects = new Dictionary<string, List<string>>();
                RequestNatureType requestNatureType = 0;
                foreach (int ReqNature in Enum.GetValues(typeof(RequestNatureType)))
                {
                    if (ReqNature == (int)RequestNatureType.Administration)
                    {
                        RequestCategoriesAndObjects = SeedData.AdministrationRequestCategoriesAndObjects;
                        requestNatureType = RequestNatureType.Administration;
                    }
                    else if (ReqNature == (int)RequestNatureType.Technical)
                    {
                        RequestCategoriesAndObjects = SeedData.TechnicalRequestCategoriesAndObjects;
                        requestNatureType = RequestNatureType.Technical;
                    }
                    else if (ReqNature == (int)RequestNatureType.Sales)
                    {
                        RequestCategoriesAndObjects = SeedData.SalesRequestCategoriesAndObjects;
                        requestNatureType = RequestNatureType.Sales;
                    }

                    foreach (var ReqCat in RequestCategoriesAndObjects.Keys)
                    {
                        RequestCategory RequestCategoryToAdd = new Faker<RequestCategory>()
                               .RuleFor(v => v.Title, f => ReqCat)
                               .RuleFor(v => v.RequestNature, f => requestNatureType)
                               .RuleFor(v => v.IsDeactivated, f => false);

                        var ReqObjs = RequestCategoriesAndObjects.GetValueOrDefault(ReqCat);

                        foreach (var ReqObj in ReqObjs)
                        {
                            var RequestObject = new Faker<RequestObject>()
                               .RuleFor(v => v.Title, f => ReqObj)
                               .RuleFor(v => v.IsDeactivated, f => false);
                            RequestCategoryToAdd.RequestObjects.Add(RequestObject);
                        }
                        dbContext.RequestCategories.Add(RequestCategoryToAdd);
                    }
                }
                await dbContext.SaveChangesAsync();
            }
        }


        public static async Task SeedIdentityAsync(IServiceProvider services, ApplicationDbContext dbContext)
        {
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();

            foreach (var roleField in typeof(AuthorizationConstants.Roles).GetFields())
            {
                var roleName = (string)roleField.GetValue(null);
                if (await roleManager.FindByNameAsync(roleName) == null)
                {
                    var result = await roleManager.CreateAsync(new ApplicationRole(roleName));
                    if (result.Succeeded)
                    {
                        var role = await roleManager.FindByNameAsync(roleName);
                        var permissions = SeedData.RolePermissions.GetValueOrDefault(roleName);

                        if (permissions != null)
                            foreach (var permission in permissions)
                                await roleManager.AddClaimAsync(role, new Claim(AuthorizationConstants.ClaimTypes.Permissions, permission));
                        if (roleName != AuthorizationConstants.Roles.Retailers)
                            await CreateUserAsync(userManager, roleManager, roleName);
                    }
                }
                //else
                //{
                //    var role = await roleManager.FindByNameAsync(roleName);
                //    var permissions = SeedData.RolePermissions.GetValueOrDefault(roleName);

                //    if (permissions != null)
                //        foreach (var permission in permissions)
                //            await roleManager.AddClaimAsync(role, new Claim(AuthorizationConstants.ClaimTypes.Permissions, permission));
                //}
            }

            foreach (var userField in typeof(AuthorizationConstants.ExternalUsers).GetFields())
            {
                var username = (string)userField.GetValue(null);
                if (await userManager.FindByNameAsync(username) == null)
                {
                    var result = await userManager.CreateAsync(new ApplicationUser()
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserName = username,
                        Email = $"{username}@sgln.ma",
                        IsExternal = true
                    }, AuthorizationConstants.DefaultPasswordExt);

                    if (result.Succeeded)
                    {
                        var user = await userManager.FindByNameAsync(username);
                        var permissions = SeedData.ExternalUserPermissions.GetValueOrDefault(username);
                        if (permissions != null)
                            foreach (var permission in permissions)
                                await userManager.AddClaimAsync(user, new Claim(AuthorizationConstants.ClaimTypes.Permissions, permission));
                    }
                }
            }

            await dbContext.SaveChangesAsync();
        }

        public static async Task SeedIdentityAdminOnlyAsync(IServiceProvider services, ApplicationDbContext dbContext)
        {
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();

            foreach (var roleField in typeof(AuthorizationConstants.Roles).GetFields())
            {
                var roleName = (string)roleField.GetValue(null);
                if (await roleManager.FindByNameAsync(roleName) == null)
                {
                    var result = await roleManager.CreateAsync(new ApplicationRole(roleName));
                    if (result.Succeeded)
                    {
                        var role = await roleManager.FindByNameAsync(roleName);
                        var permissions = SeedData.RolePermissions.GetValueOrDefault(roleName);

                        if (permissions != null)
                            foreach (var permission in permissions)
                                await roleManager.AddClaimAsync(role, new Claim(AuthorizationConstants.ClaimTypes.Permissions, permission));

                        if (roleName == AuthorizationConstants.Roles.Administrators)
                            await CreateUserAsync(userManager, roleManager, roleName);
                    }
                }

                //foreach (var userField in typeof(AuthorizationConstants.ExternalUsers).GetFields())
                //{
                //    var username = (string)userField.GetValue(null);
                //    if (await userManager.FindByNameAsync(username) == null)
                //    {
                //        var result = await userManager.CreateAsync(new ApplicationUser()
                //        {
                //            Id = Guid.NewGuid().ToString(),
                //            UserName = username,
                //            Email = $"{username}@loterie.ma",
                //            IsExternal = true
                //        }, AuthorizationConstants.DefaultPasswordExt);

                //        //if (result.Succeeded)
                //        //{
                //        //    var user = await userManager.FindByNameAsync(username);
                //        //    var permissions = SeedData.ExternalUserPermissions.GetValueOrDefault(username);
                //        //    if (permissions != null)
                //        //        foreach (var permission in permissions)
                //        //            await userManager.AddClaimAsync(user, new Claim(AuthorizationConstants.ClaimTypes.Permissions, permission));
                //        //}
                //    }
                //}
            }

            await dbContext.SaveChangesAsync();
        }

        public static async Task SeedRetailersDataAsync(IServiceProvider services, ApplicationDbContext dbContext)
        {
            if (!dbContext.Retailers.Any())
            {
                var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                foreach (List<object> entry in SeedData.Retailers)
                {
                    var appuser = CreateUserRetailerAsync(0, services, userManager).Result;
                    var retailertoAdd = new Retailer()
                    {
                        Civility = (string)entry[0],
                        FirstName = (string)entry[1],
                        LastName = (string)entry[2],
                        Phone = (string)entry[3],
                        Email = (string)entry[4],
                        Address = (string)entry[5],
                        InternalRetailerCode = (string)entry[6],
                        ExternalRetailerCode = (string)entry[7],
                        Activity = (string)entry[8],
                        WeeklySalesLimit = (double)entry[9],
                        AnnualCA = (double)entry[10],
                        TotalCommissions = (double)entry[11],
                        TotalUnpaid = (double)entry[12],
                        ContractNumber = (string)entry[13],
                        CompanyIdentifier = (string)entry[14],
                        GeographicSector = (string)entry[15],
                        CurrentBalance = (double)entry[16],
                        AdressLatitude = (double)entry[17],
                        AdressLongitude = (double)entry[18],
                        City = (string)entry[19]
                    };
                    string mailagent = (string)entry[20];
                    var agent = dbContext.Users.Where(u => u.Email.Contains(mailagent)).FirstOrDefault();

                    retailertoAdd.UserId = appuser?.Id;
                    retailertoAdd.AgentId = agent?.Id;
                    dbContext.Retailers.Add(retailertoAdd);
                    await dbContext.SaveChangesAsync();
                }
            }
        }


        private static async Task CreateUserAsync(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, string roleName)
        {
            var username = roleName.ToLower().Remove(roleName.Length - 1);
            ApplicationUser user = new Faker<ApplicationUser>()
                .RuleFor(v => v.Id, f => Guid.NewGuid().ToString())
                .RuleFor(v => v.UserName, f => $"{username}@sgln")
                .RuleFor(v => v.Email, f => $"{username}@loterie.ma")
                .RuleFor(v => v.FirstName, f => f.Person.FirstName)
                .RuleFor(v => v.LastName, f => f.Person.LastName)
                .RuleFor(v => v.PhoneNumber, f => f.Person.Phone);

            var result = await userManager.CreateAsync(user, AuthorizationConstants.DefaultPassword);

            if (result.Succeeded)
            {
                user = await userManager.FindByNameAsync(user.UserName);
                if (user != null)
                    await userManager.AddToRoleAsync(user, roleName);
            }
        }

        private static async Task<ApplicationUser> CreateUserRetailerAsync(int index, IServiceProvider services, UserManager<ApplicationUser> userManager)
        {
            var roleName = AuthorizationConstants.Roles.Retailers;
            var username = roleName.ToLower().Remove(roleName.Length - 1);
            ApplicationUser user = new Faker<ApplicationUser>()
                .RuleFor(v => v.Id, f => Guid.NewGuid().ToString())
                .RuleFor(v => v.UserName, f => $"detaillant{index + 1}@sgln")
                .RuleFor(v => v.Email, f => $"{username}@loterie.ma")
                .RuleFor(v => v.FirstName, f => f.Person.FirstName)
                .RuleFor(v => v.LastName, f => f.Person.LastName)
                .RuleFor(v => v.IsValidated, f => true)
                .RuleFor(v => v.IsDeactivated, f => false)
                .RuleFor(v => v.PhoneNumber, f => f.Person.Phone);

            var result = await userManager.CreateAsync(user, AuthorizationConstants.DefaultPassword);

            if (result.Succeeded)
            {
                user = await userManager.FindByNameAsync(user.UserName);
                if (user != null)
                    await userManager.AddToRoleAsync(user, roleName);
            }
            return user;
        }

        public static async Task SeedUserAgentsAsync(IServiceProvider services, ApplicationDbContext dbContext)
        {
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            List<string> roleNames = new List<string>();
            roleNames.Add(AuthorizationConstants.Roles.InternalAgent);
            roleNames.Add(AuthorizationConstants.Roles.ExternalAgent);
            foreach (string roleName in roleNames)
            {
                string username = null;
                if (roleName == AuthorizationConstants.Roles.InternalAgent)
                    username = "agentsgln";
                else if (roleName == AuthorizationConstants.Roles.ExternalAgent)
                    username = "agentoperateur";

                for (int i = 1; i < 10; i++)
                {
                    ApplicationUser user = new ApplicationUser();

                    if (roleName != AuthorizationConstants.Roles.ExternalAgent)
                        user = new Faker<ApplicationUser>()
                        .RuleFor(v => v.Id, f => Guid.NewGuid().ToString())
                        .RuleFor(v => v.FirstName, f => f.Person.FirstName)
                        .RuleFor(v => v.LastName, f => f.Person.LastName)
                        .RuleFor(v => v.PhoneNumber, f => f.Person.Phone)
                        .RuleFor(v => v.Administration, f => f.PickRandom<ProcessingDirectionType>());
                    else
                        user = new Faker<ApplicationUser>()
                        .RuleFor(v => v.Id, f => Guid.NewGuid().ToString())
                        .RuleFor(v => v.FirstName, f => f.Person.FirstName)
                        .RuleFor(v => v.LastName, f => f.Person.LastName)
                        .RuleFor(v => v.PhoneNumber, f => f.Person.Phone);

                    user.IsValidated = true;
                    user.Created = DateTime.Now;
                    user.UserName = $"{username}{i}";
                    user.Email = $"{username}{i}@loterie.ma";

                    if (!dbContext.Users.Any(u => u.UserName == username))
                    {
                        var result = await userManager.CreateAsync(user, AuthorizationConstants.DefaultPassword);
                        if (result.Succeeded)
                        {
                            user = await userManager.FindByNameAsync(user.UserName);
                            if (user != null)
                                await userManager.AddToRoleAsync(user, roleName);
                        }
                    }
                }
            }
        }

        private static async Task CreateTrainingModuleAsync(ApplicationDbContext dbContext)
        {
            if (!dbContext.TrainingModules.Any())
            {
                for (int i = 0; i < 10; i++)
                {
                    var trainingModule = new Faker<TrainingModule>()
                       .RuleFor(v => v.Title, f => f.Random.Words());
                    dbContext.TrainingModules.Add(trainingModule);
                }

                await dbContext.SaveChangesAsync();
            }
        }

        public static async Task CreateTrainingsAsync(ApplicationDbContext dbContext)
        {
            await CreateTrainingAsync(dbContext);
            await CreateTrainingSlidesAndQuestionsAsync(dbContext);
            await CreateTrainingQuestionOptionsAsync(dbContext);
        }

        private static async Task CreateTrainingAsync(ApplicationDbContext dbContext)
        {
            if (!dbContext.Trainings.Any())
            {
                for (int i = 0; i < 10; i++)
                {
                    var module = dbContext.TrainingModules.FirstOrDefault();

                    var training = new Faker<Training>()
                       .RuleFor(v => v.Title, f => f.Random.Words())
                       .RuleFor(v => v.Description, f => f.Random.Words())
                       .RuleFor(v => v.ModuleId, f => module.Id)
                       .RuleFor(v => v.Type, f => f.PickRandom<TrainingType>())
                       .RuleFor(v => v.StartDate, f => f.Date.Recent())
                       .RuleFor(v => v.EndDate, f => f.Date.Future());
                    dbContext.Trainings.Add(training);
                }
                await dbContext.SaveChangesAsync();
            }
        }

        private static async Task CreateTrainingSlidesAndQuestionsAsync(ApplicationDbContext dbContext)
        {
            if (!dbContext.TrainingDocuments.Any() && !dbContext.TrainingQuestions.Any())
            {
                var Trainings = dbContext.Trainings.Where(t => t.Type == TrainingType.Interactive).ToList();
                foreach (var training in Trainings)
                {
                    for (int i = 0; i < 4; i++)
                    {
                        var trainingdoc = new Faker<TrainingDocument>()
                           .RuleFor(v => v.TrainingId, f => training.Id)
                           .RuleFor(v => v.Type, f => DocumentType.TrainingCourseSlide)
                           .RuleFor(v => v.MimeType, f => "image/png");
                        dbContext.TrainingDocuments.Add(trainingdoc);
                    }
                    for (int i = 0; i < 4; i++)
                    {
                        var trainingQuestion = new Faker<TrainingQuestion>()
                           .RuleFor(v => v.TrainingId, f => training.Id)
                           .RuleFor(v => v.Label, f => f.Random.Words());
                        dbContext.TrainingQuestions.Add(trainingQuestion);
                    }
                }
                await dbContext.SaveChangesAsync();
            }
        }

        private static async Task CreateTrainingQuestionOptionsAsync(ApplicationDbContext dbContext)
        {
            if (!dbContext.TrainingQuestionOptions.Any())
            {
                var trainingQuestions = dbContext.TrainingQuestions.ToList();
                foreach (var trainingque in trainingQuestions)
                {
                    for (int i = 0; i < 4; i++)
                    {
                        var trainingQuestionOption = new Faker<TrainingQuestionOption>()
                           .RuleFor(v => v.TrainingQuestionId, f => trainingque.Id)
                           .RuleFor(v => v.Label, f => f.Random.Words())
                           .RuleFor(v => v.IsCorrect, f => i == 0 ? true : false);
                        dbContext.TrainingQuestionOptions.Add(trainingQuestionOption);
                    }
                }
                await dbContext.SaveChangesAsync();
            }
        }

    }
}