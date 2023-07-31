namespace ACG.SGLN.Lottery.Domain.Constants
{
    public static class AuthorizationConstants
    {
        public const string DefaultUserName = "administrator@sgln";
        public const string DefaultPassword = "ACG@sgln@2021";
        public const string DefaultPasswordExt = "Qy6LekRXbDG4$yF5d";
        public const string DefaultDeviceTokenName = "DeviceToken";

        public static class ClaimTypes
        {
            public const string Permissions = "permissions";
            public const string Role = "roleNames";
            public const string UserId = "userId";
            public const string FullName = "fullName";
            public const string Administration = "administration";
        }

        public static class Roles
        {
            public const string Administrators = "Administrators";
            public const string Retailers = "Retailers";
            public const string InternalAgent = "InternalAgents"; //SGLN
            public const string ExternalAgent = "ExternalAgents"; // Operator
            public const string PlatformManager = "PlatformManagers"; // PlatformManager
        }

        public static class ExternalUsers
        {
            public const string BABatchJob = "BABatchJob_Ext";
        }

        //NOTE: dir .\* /AD /B /ON /S
        public static class Permissions
        {
            //[Cities]
            public const string CanGetAllCities = "CanGetAllCities";
            public const string CanCreateCity = "CanCreateCity";
            public const string CanDeleteCity = "CanDeleteCity";
            public const string CanUpdateCity = "CanUpdateCity";


            //[Annoucements]
            public const string CanCreateAnnouncement = "CanCreateAnnouncement";
            public const string CanDeleteAnnouncement = "CanDeleteAnnouncement";
            public const string CanTogglePublishStatus = "CanTogglePublishStatus";
            public const string CanGetAnnouncements = "CanGetAnnouncements";
            public const string CanGetAnnouncementById = "CanGetAnnouncementById";

            //[Notifications]
            public const string CanCreateNotification = "CanCreateNotification";
            public const string CanGetStrippedNotifications = "CanGetStrippedNotifications";
            public const string CanGetNotifications = "CanGetNotifications";
            public const string CanDeleteNotification = "CanDeleteNotification";

            //[RequestComments]
            public const string CanCreateRequestComment = "CanCreateRequestComment";
            public const string CanDeleteRequestComment = "CanDeleteRequestComment";
            public const string CanGetRequestComments = "CanGetRequestComments";

            //[RequestObjects]
            public const string CanCreateRequestObject = "CanCreateRequestObject";
            public const string CanDeleteRequestObject = "CanDeleteRequestObject";
            public const string CanUpdateRequestObject = "CanUpdateRequestObject";
            public const string CanGetStrippedRequestObjects = "CanGetStrippedRequestObjects";
            public const string CanGetRequestObjects = "CanGetRequestObjects";
            public const string CanToggleRequestObjectStatus = "CanToggleRequestObjectStatus";
            public const string CanGetRequestObjectsValidity = "CanGetRequestObjectsValidity";


            //[Requests]
            public const string CanCreateRequest = "CanCreateRequest";
            public const string CanCancelRequest = "CanCancelRequest";
            public const string CanContestRequest = "CanContestRequest";
            public const string CanCloseRequest = "CanCloseRequest";
            public const string CanStartRequest = "CanStartRequest";
            public const string CanGetRequests = "CanGetRequests";
            public const string CanGetRequestById = "CanGetRequestById";
            public const string CanGetRequestCommentsById = "CanGetRequestCommentsById";
            public const string CanAssignRequest = "CanAssignRequest";

            //[Retailers]
            public const string CanCreateRetailer = "CanCreateRetailer";
            public const string CanCreateRetailers = "CanCreateRetailers";
            public const string CanDeleteRetailer = "CanDeleteRetailer";
            public const string CanToggleNotifcation = "CanToggleNotifcation";
            public const string CanUpdateRetailer = "CanUpdateRetailer";
            public const string CanUpdateRetailers = "CanUpdateRetailers";
            public const string CanGetRetailers = "CanGetRetailers";
            public const string CanGetCurrentRetailer = "CanGetCurrentRetailer";
            public const string CanGetRetailerAgent = "CanGetRetailerAgent";
            public const string CanGetRetailerById = "CanGetRetailerById";
            public const string CanGetRetailerDocuments = "CanGetRetailerDocuments";
            public const string CanGetStrippedRetailers = "CanGetStrippedRetailers";

            //[Roles]
            public const string CanGetRoles = "CanGetRoles";

            //[SupportDocuments]
            public const string CanGetSupportDocuments = "CanGetSupportDocuments";
            public const string CanGetApplicationDocuments = "CanGetApplicationDocuments";

            //[Trainings]
            public const string CanStartTraining = "CanStartTraining";
            public const string CanCompleteTraining = "CanCompleteTraining";
            public const string CanCreateInteractiveTraining = "CanCreateInteractiveTraining";
            public const string CanCreateLiveTraining = "CanCreateLiveTraining";
            public const string CanCreateVideoTraining = "CanCreateVideoTraining";
            public const string CanFinishTraining = "CanFinishTraining";
            public const string CanToggleTrainingStatus = "CanToggleTrainingStatus";
            public const string CanGetTrainings = "CanGetTrainings";
            public const string CanGetTrainingById = "CanGetTrainingById";
            public const string CanGetTrainingQuestionsById = "CanGetTrainingQuestionsById";
            public const string CanGetRetailerTrainings = "CanGetRetailerTrainings";
            public const string CanEditLiveTraining = "CanEditLiveTraining";
            public const string CanEditVideoTraining = "CanEditVideoTraining";
            public const string CanGetTrainingSlidesById = "CanGetTrainingSlidesById";
            public const string CanEditInteractiveTraining = "CanEditInteractiveTraining";
            public const string CanGenerateCertificate = "CanGenerateCertificate";

            //[Users]
            public const string CanChangeUserPassword = "CanChangeUserPassword";
            public const string CanCreateUser = "CanCreateUser";
            public const string CanDeleteUser = "CanDeleteUser";
            public const string CanForgotPassword = "CanForgotPassword";
            public const string CanResetPassword = "CanResetPassword";
            public const string CanUserSignIn = "CanUserSignIn";
            public const string CanUserSignOut = "CanUserSignOut";
            public const string CanToggleUserStatus = "CanToggleUserStatus";
            public const string CanUpdateUser = "CanUpdateUser";
            public const string CanUpdateUserRole = "CanUpdateUserRole";
            public const string CanValidateUser = "CanValidateUser";
            public const string CanGetConnectedUser = "CanGetConnectedUser";
            public const string CanGetUserByEmail = "CanGetUserByEmail";
            public const string CanGetUserById = "CanGetUserById";
            public const string CanGetUsers = "CanGetUsers";
            public const string CanGetUsersByRoles = "CanGetUsersByRoles";

            //[TrainingModules]
            public const string CanCreateTrainingModule = "CanCreateTrainingModule";
            public const string CanDeleteTrainingModule = "CanDeleteTrainingModule";
            public const string CanGetStrippedTrainingModules = "CanGetStrippedTrainingModules";
            public const string CanGetTrainingModuleById = "CanGetTrainingModuleById";
            public const string CanGetTrainingModules = "CanGetTrainingModules";

            //[ExcellencePrograms]
            public const string CanGetExcellenceProgram = "CanGetExcellenceProgram";
            public const string CanGetIncentives = "CanGetIncentives";

            //[Invoices]
            public const string CanGetInvoicesByDate = "CanGetInvoicesByDate";
            public const string CanGetStatusInvoice = "CanGetStatusInvoice";

            //[ApplicationDocuments]
            public const string GetApplicationDocuments = "GetApplicationDocuments";

            //[Reporting]
            public const string CanGetIncentivesReport = "CanGetIncentivesReport";
            public const string CanGetTrainingsByModuleReport = "CanGetTrainingsByModuleReport";
            public const string CanGetTrainingsByRetailerReport = "CanGetTrainingsByRetailerReport";

            //[Reporting]
            public const string CanCreateRequestCategory = "CanCreateRequestCategory";
            public const string CanDeleteRequestCategory = "CanDeleteRequestCategory";
            public const string CanToggleRequestCategoryStatus = "CanToggleRequestCategoryStatus";
            public const string CanUpdateRequestCategory = "CanUpdateRequestCategory";
            public const string CanGetRequestCategories = "CanGetRequestCategories";
            public const string CanGetStrippedRequestCategories = "CanGetStrippedRequestCategories";
            public const string CanGetStrippedRequestCategoriesByNature = "CanGetStrippedRequestCategoriesByNature";

        }
    }
}