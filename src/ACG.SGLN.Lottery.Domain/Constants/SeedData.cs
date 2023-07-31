using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Constants
{
    public static class SeedData
    {
        public static List<string> Cities = new List<string>
        {
           "Afourar",
           "Agadir",
           "Ait Melloul",
           "Al Hoceima",
           "Amizmiz",
           "Aourir",
           "Assila",
           "Azemmour",
           "Azilal",
           "Azrou",
           "Aït Baha",
           "Bejaâd",
           "Ben Ahmed",
           "Benguerir",
           "Benslimane",
           "Berkane",
           "Berrechid",
           "Bin Elouidane",
           "Bni Ansar",
           "Bouarfa",
           "Boujdour",
           "Bouknadel",
           "Boulemane",
           "Bouznika",
           "Béni Mellal",
           "Casablanca",
           "Chefchaouen",
           "Chichaoua",
           "Dakhla",
           "Demnate",
           "El Borouj",
           "El Gara",
           "El Hajeb",
           "El Jadida",
           "El Kelaâ des Sraghna",
           "Erfoud",
           "Errachidia",
           "Es-Semara",
           "Essaouira",
           "Figuig",
           "Fkih Ben Salah",
           "Fnideq",
           "Fès",
           "Guelmim",
           "Guercif",
           "Had Kourt",
           "Harhoura",
           "Ifrane",
           "Imintanoute",
           "Imouzzer Kandar",
           "Jerada",
           "Jorf Lasfar",
           "Kasba Tadla",
           "Kelaat-M'Gouna",
           "Khemis Zemamra",
           "Khouribga",
           "Khémisset",
           "Khénifra",
           "Ksar El Kebir",
           "Kénitra",
           "Laayoune",
           "Lagouira",
           "Larache",
           "M'dik",
           "M'rirt",
           "Marrakech",
           "Martil",
           "Mehdia",
           "Meknès",
           "Midelt",
           "Missour",
           "Mohammedia",
           "Moulay Bousselham",
           "Moulay Yaâcoub",
           "Mzouda",
           "Nador",
           "Ouarzazate",
           "Ouazzane",
           "Oued Laou",
           "Oued Zem",
           "Ouezzane",
           "Oujda",
           "Rabat",
           "Ras El Aïn",
           "Rissani",
           "Rommani",
           "Safi",
           "Salé",
           "Saïdia",
           "Sefrou",
           "Settat",
           "Sidi Allal El Bahraoui",
           "Sidi Bennour",
           "Sidi Ifni",
           "Sidi Kacem",
           "Sidi Slimane",
           "Sidi Taibi",
           "Sidi Yahya El Gharb",
           "Sidi Yahya Ou Saad",
           "Sidi Yahya Ou Youssef",
           "Skhirat",
           "Souk El Arbaa",
           "Tafraout",
           "Taghazout",
           "Tan-Tan",
           "Tanger",
           "Taounate",
           "Tarfaya",
           "Taroudant",
           "Tata",
           "Taza",
           "Tiflet",
           "Tit Mellil",
           "Tiznit",
           "Témara",
           "Tétouan",
           "Zagora"
        };
        public static class Roles
        {
            public const string Administrators = "Administrators";
            public const string Retailers = "Retailers";
            public const string InternalAgent = "InternalAgents"; //SGLN
            public const string ExternalAgent = "ExternalAgents"; // Operator
            public const string PlatformManager = "PlatformManagers"; // Platform Manager

        }

        public static Dictionary<string, string> RolesTranslations = new Dictionary<string, string>()
        {
            { AuthorizationConstants.Roles.Retailers, "Détaillant"},
            { AuthorizationConstants.Roles.Administrators, "Administrateur"},
            { AuthorizationConstants.Roles.InternalAgent, "Agent SGLN"},
            { AuthorizationConstants.Roles.ExternalAgent, "Agent Opérateur"},
            { AuthorizationConstants.Roles.PlatformManager, "Responsable plateforme"}
        };

        public static Dictionary<string, List<string>> RolePermissions = new Dictionary<string, List<string>>()
        {
            { AuthorizationConstants.Roles.Retailers, new List<string>()
            {
                AuthorizationConstants.Permissions.CanGenerateCertificate,
                AuthorizationConstants.Permissions.CanGetTrainingModuleById,
                AuthorizationConstants.Permissions.CanGetTrainingModules,
                AuthorizationConstants.Permissions.CanGetStrippedTrainingModules,
                AuthorizationConstants.Permissions.CanGetApplicationDocuments,
                AuthorizationConstants.Permissions.CanGetRetailerTrainings,
                AuthorizationConstants.Permissions.CanGetAnnouncements,
                AuthorizationConstants.Permissions.CanGetAnnouncementById,
                AuthorizationConstants.Permissions.CanGetStrippedNotifications,
                AuthorizationConstants.Permissions.CanGetNotifications,
                AuthorizationConstants.Permissions.CanGetStrippedRequestObjects,
                AuthorizationConstants.Permissions.CanGetRequestObjects,
                AuthorizationConstants.Permissions.CanGetRequestObjectsValidity,
                AuthorizationConstants.Permissions.CanCreateRequest,
                AuthorizationConstants.Permissions.CanCancelRequest,
                AuthorizationConstants.Permissions.CanContestRequest,
                AuthorizationConstants.Permissions.CanGetRequests,
                AuthorizationConstants.Permissions.CanGetRequestById,
                AuthorizationConstants.Permissions.CanGetRequestCommentsById,
                AuthorizationConstants.Permissions.CanToggleNotifcation,
                AuthorizationConstants.Permissions.CanGetCurrentRetailer,
                AuthorizationConstants.Permissions.CanGetRetailerAgent,
                AuthorizationConstants.Permissions.CanGetRetailerDocuments,
                AuthorizationConstants.Permissions.CanGetSupportDocuments,
                AuthorizationConstants.Permissions.CanStartTraining,
                AuthorizationConstants.Permissions.CanCompleteTraining,
                AuthorizationConstants.Permissions.CanFinishTraining,
                AuthorizationConstants.Permissions.CanGetTrainingById,
                AuthorizationConstants.Permissions.CanGetTrainingQuestionsById,
                AuthorizationConstants.Permissions.CanGetTrainingSlidesById,
                AuthorizationConstants.Permissions.CanChangeUserPassword,
                AuthorizationConstants.Permissions.CanForgotPassword,
                AuthorizationConstants.Permissions.CanResetPassword,
                AuthorizationConstants.Permissions.CanUserSignIn,
                AuthorizationConstants.Permissions.CanUserSignOut,
                AuthorizationConstants.Permissions.CanUpdateUser,
                AuthorizationConstants.Permissions.CanGetConnectedUser,
                AuthorizationConstants.Permissions.CanGetUserById,
                //AuthorizationConstants.Permissions.CanGetUsers,
                //AuthorizationConstants.Permissions.CanGetUsersByRoles,

                AuthorizationConstants.Permissions.CanGetInvoicesByDate,
                AuthorizationConstants.Permissions.CanGetStatusInvoice,
                AuthorizationConstants.Permissions.CanGetExcellenceProgram,
                AuthorizationConstants.Permissions.CanGetIncentives,

                AuthorizationConstants.Permissions.CanCreateRequestCategory ,
                AuthorizationConstants.Permissions.CanDeleteRequestCategory ,
                AuthorizationConstants.Permissions.CanToggleRequestCategoryStatus ,
                AuthorizationConstants.Permissions.CanUpdateRequestCategory ,
                AuthorizationConstants.Permissions.CanGetRequestCategories ,
                AuthorizationConstants.Permissions.CanGetStrippedRequestCategories ,
                AuthorizationConstants.Permissions.CanGetStrippedRequestCategoriesByNature

            } },
            { AuthorizationConstants.Roles.InternalAgent, new List<string>()
            {
                    AuthorizationConstants.Permissions.CanGetTrainingModuleById,
                    AuthorizationConstants.Permissions.CanGetStrippedTrainingModules,
                    AuthorizationConstants.Permissions.CanEditLiveTraining,
                    AuthorizationConstants.Permissions.CanEditVideoTraining,
                    AuthorizationConstants.Permissions.CanEditInteractiveTraining,
                    AuthorizationConstants.Permissions.CanToggleTrainingStatus,
                    AuthorizationConstants.Permissions.CanGetTrainingSlidesById,
                    AuthorizationConstants.Permissions.CanCreateInteractiveTraining,
                    AuthorizationConstants.Permissions.CanCreateLiveTraining,
                    AuthorizationConstants.Permissions.CanCreateVideoTraining,
                    AuthorizationConstants.Permissions.CanGetTrainings,
                    AuthorizationConstants.Permissions.CanGetTrainingById,
                    AuthorizationConstants.Permissions.CanGetTrainingQuestionsById,
                    AuthorizationConstants.Permissions.CanCreateAnnouncement,
                    AuthorizationConstants.Permissions.CanDeleteAnnouncement,
                    AuthorizationConstants.Permissions.CanTogglePublishStatus,
                    AuthorizationConstants.Permissions.CanGetAnnouncements,
                    AuthorizationConstants.Permissions.CanGetAnnouncementById,
                    AuthorizationConstants.Permissions.CanCreateNotification,
                    AuthorizationConstants.Permissions.CanGetStrippedNotifications,
                    AuthorizationConstants.Permissions.CanGetNotifications,
                    AuthorizationConstants.Permissions.CanCreateRequestComment,
                    AuthorizationConstants.Permissions.CanDeleteRequestComment,
                    AuthorizationConstants.Permissions.CanGetRequestComments,
                    AuthorizationConstants.Permissions.CanGetStrippedRequestObjects,
                    AuthorizationConstants.Permissions.CanToggleRequestObjectStatus,
                    AuthorizationConstants.Permissions.CanCloseRequest,
                    AuthorizationConstants.Permissions.CanStartRequest,
                    AuthorizationConstants.Permissions.CanGetRequests,
                    AuthorizationConstants.Permissions.CanGetRequestById,
                    AuthorizationConstants.Permissions.CanGetRequestCommentsById,
                    AuthorizationConstants.Permissions.CanCreateRetailer,
                    AuthorizationConstants.Permissions.CanDeleteRetailer,
                    AuthorizationConstants.Permissions.CanUpdateRetailer,
                    AuthorizationConstants.Permissions.CanGetRetailers,
                    AuthorizationConstants.Permissions.CanGetRetailerAgent,
                    AuthorizationConstants.Permissions.CanGetRetailerById,
                    AuthorizationConstants.Permissions.CanGetRetailerDocuments,
                    AuthorizationConstants.Permissions.CanGetStrippedRetailers,
                    AuthorizationConstants.Permissions.CanGetSupportDocuments,
                    AuthorizationConstants.Permissions.CanGetRoles,
                    AuthorizationConstants.Permissions.CanChangeUserPassword,
                    AuthorizationConstants.Permissions.CanGetConnectedUser,
                    AuthorizationConstants.Permissions.CanGetIncentivesReport,
                    AuthorizationConstants.Permissions.CanGetTrainingsByModuleReport,
                    AuthorizationConstants.Permissions.CanGetTrainingsByRetailerReport,
                    AuthorizationConstants.Permissions.CanGetExcellenceProgram,
                    AuthorizationConstants.Permissions.CanGetIncentives,
                    AuthorizationConstants.Permissions.CanToggleRequestCategoryStatus ,
                    AuthorizationConstants.Permissions.CanUpdateRequestCategory ,
                    AuthorizationConstants.Permissions.CanGetStrippedRequestCategories ,
                    AuthorizationConstants.Permissions.CanGetStrippedRequestCategoriesByNature
            } },
            { AuthorizationConstants.Roles.ExternalAgent, new List<string>()
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
                AuthorizationConstants.Permissions.CanGetStrippedRequestCategoriesByNature
            } },
            { AuthorizationConstants.Roles.PlatformManager, new List<string>()
            {
                    AuthorizationConstants.Permissions.CanGetTrainingModuleById,
                    AuthorizationConstants.Permissions.CanGetStrippedTrainingModules,
                    AuthorizationConstants.Permissions.CanGetTrainingModules,
                    AuthorizationConstants.Permissions.CanCreateTrainingModule,
                    AuthorizationConstants.Permissions.CanDeleteTrainingModule,
                    AuthorizationConstants.Permissions.CanEditLiveTraining,
                    AuthorizationConstants.Permissions.CanEditVideoTraining,
                    AuthorizationConstants.Permissions.CanEditInteractiveTraining,
                    AuthorizationConstants.Permissions.CanToggleTrainingStatus,
                    AuthorizationConstants.Permissions.CanGetTrainingSlidesById,
                    AuthorizationConstants.Permissions.CanCreateInteractiveTraining,
                    AuthorizationConstants.Permissions.CanCreateLiveTraining,
                    AuthorizationConstants.Permissions.CanCreateVideoTraining,
                    AuthorizationConstants.Permissions.CanGetTrainings,
                    AuthorizationConstants.Permissions.CanGetTrainingById,
                    AuthorizationConstants.Permissions.CanGetTrainingQuestionsById,
                    AuthorizationConstants.Permissions.CanCreateAnnouncement,
                    AuthorizationConstants.Permissions.CanDeleteAnnouncement,
                    AuthorizationConstants.Permissions.CanTogglePublishStatus,
                    AuthorizationConstants.Permissions.CanGetAnnouncements,
                    AuthorizationConstants.Permissions.CanGetAnnouncementById,
                    AuthorizationConstants.Permissions.CanCreateNotification,
                    AuthorizationConstants.Permissions.CanGetStrippedNotifications,
                    AuthorizationConstants.Permissions.CanGetNotifications,
                    AuthorizationConstants.Permissions.CanCreateRequestComment,
                    AuthorizationConstants.Permissions.CanDeleteRequestComment,
                    AuthorizationConstants.Permissions.CanGetRequestComments,
                    AuthorizationConstants.Permissions.CanCreateRequestObject,
                    AuthorizationConstants.Permissions.CanDeleteRequestObject,
                    AuthorizationConstants.Permissions.CanUpdateRequestObject,
                    AuthorizationConstants.Permissions.CanGetStrippedRequestObjects,
                    AuthorizationConstants.Permissions.CanGetRequestObjects,
                    AuthorizationConstants.Permissions.CanToggleRequestObjectStatus,
                    AuthorizationConstants.Permissions.CanGetRequests,
                    AuthorizationConstants.Permissions.CanGetRequestById,
                    AuthorizationConstants.Permissions.CanGetRequestCommentsById,
                    AuthorizationConstants.Permissions.CanCreateRetailer,
                    AuthorizationConstants.Permissions.CanDeleteRetailer,
                    AuthorizationConstants.Permissions.CanUpdateRetailer,
                    AuthorizationConstants.Permissions.CanGetRetailers,
                    AuthorizationConstants.Permissions.CanGetRetailerAgent,
                    AuthorizationConstants.Permissions.CanGetRetailerById,
                    AuthorizationConstants.Permissions.CanGetRetailerDocuments,
                    AuthorizationConstants.Permissions.CanGetStrippedRetailers,
                    AuthorizationConstants.Permissions.CanGetSupportDocuments,
                    AuthorizationConstants.Permissions.CanGetRoles,
                    AuthorizationConstants.Permissions.CanChangeUserPassword,
                    AuthorizationConstants.Permissions.CanGetConnectedUser,
                    AuthorizationConstants.Permissions.CanGetIncentivesReport,
                    AuthorizationConstants.Permissions.CanGetTrainingsByModuleReport,
                    AuthorizationConstants.Permissions.CanGetTrainingsByRetailerReport,
                    AuthorizationConstants.Permissions.CanGetExcellenceProgram,
                    AuthorizationConstants.Permissions.CanGetIncentives,
                    AuthorizationConstants.Permissions.CanCreateRequestCategory ,
                    AuthorizationConstants.Permissions.CanDeleteRequestCategory ,
                    AuthorizationConstants.Permissions.CanUpdateRequestObject,
                    AuthorizationConstants.Permissions.CanToggleRequestCategoryStatus ,
                    AuthorizationConstants.Permissions.CanUpdateRequestCategory ,
                    AuthorizationConstants.Permissions.CanGetRequestCategories ,
                    AuthorizationConstants.Permissions.CanGetStrippedRequestCategories ,
                    AuthorizationConstants.Permissions.CanGetStrippedRequestCategoriesByNature,
                    AuthorizationConstants.Permissions.CanAssignRequest
            } },

            { AuthorizationConstants.Roles.Administrators, new List<string>()
            {
            } }
        };

        public static Dictionary<string, List<string>> ExternalUserPermissions = new Dictionary<string, List<string>>()
        {
            { AuthorizationConstants.ExternalUsers.BABatchJob, new List<string>()
            {
                AuthorizationConstants.Permissions.CanCreateRetailer,
                AuthorizationConstants.Permissions.CanCreateRetailers,
                AuthorizationConstants.Permissions.CanUpdateRetailer,
                AuthorizationConstants.Permissions.CanUpdateRetailers
            } },
        };

        public static List<object> Retailers = new List<object>
        {
            new List<object>()
            {
                /*Civility =*/ "M",/* FirstName =*/ "anas",/* LastName =*/ "kadmiri",/*  Phone =*/ "0636251485",/*  Email =*/ "anask@sgln.ma",/*
                /*Address =*/ "rabat,/* agdal rue taounat 201",/* InternalRetailerCode =*/ "InternalRetailerCodetest",/* ExternalRetailerCode =*/ "ExternalRetailerCodetest",/*
                /*Activity =*/ "Activitytest",/* WeeklySalesLimit =*/ 20000,/* AnnualCA =*/ 15000000,/* TotalCommissions =*/ 3300,/*
                /*TotalUnpaid =*/ 4000,/* ContractNumber =*/ "0625148596",/* CompanyIdentifier =*/ "CompanyIdentifiertest",/* GeographicSector =*/ "GeographicSectortest",/*
                /*CurrentBalance =*/ 500,/* AdressLatitude =*/ 1.26987698,/* AdressLongitude =*/ 225.622866 ,/* City =*/ "Rabat", /* AgentEmail*/ "internalagent@sgln.ma"
            },
            new List<object>()
            {
                /*Civility =*/ "Mme",/* FirstName =*/ "souad",/* LastName =*/ "raji",/*  Phone =*/ "0636471485",/*  Email =*/ "souadr@sgln.ma",/*
                /*Address =*/ "rabat,/* Hassan rue tanger 201",/* InternalRetailerCode =*/ "InternalCodetestRaji",/* ExternalRetailerCode =*/ "ExternalCodetestRaji",/*
                /*Activity =*/ "Activitytest",/* WeeklySalesLimit =*/ 14650,/* AnnualCA =*/ 15054500,/* TotalCommissions =*/ 36200,/*
                /*TotalUnpaid =*/ 26590,/* ContractNumber =*/ "0636148596",/* CompanyIdentifier =*/ "CompanyIdentifiertest",/* GeographicSector =*/ "GeographicSectortest",/*
                /*CurrentBalance =*/ 1500,/* AdressLatitude =*/ 154.2696578,/* AdressLongitude =*/ 249.6597866,/* City =*/ "Rabat", /* AgentEmail*/ "internalagent@sgln.ma"
            }
            //new Retailer()
            //{
            //    Civility = "M", FirstName = "anas", LastName = "kadmiri",  Phone = "0636251485",  Email = "anask@sgln.ma", 
            //    Address = "rabat, agdal rue taounat 201", InternalRetailerCode = "InternalRetailerCodetest", ExternalRetailerCode = "ExternalRetailerCodetest",
            //    Activity = "Activitytest", WeeklySalesLimit = 20000, AnnualCA = 15000000, TotalCommissions = 3300,
            //    TotalUnpaid = 4000, ContractNumber = "0625148596", CompanyIdentifier = "CompanyIdentifiertest", GeographicSector = "GeographicSectortest", 
            //    CurrentBalance = 500, AdressLatitude = 1.26987698, AdressLongitude = 225.622866 , City = "Rabat"
            //},
            //new Retailer()
            //{
            //    Civility = "Mme", FirstName = "souad", LastName = "raji",  Phone = "0636471485",  Email = "souadr@sgln.ma",
            //    Address = "rabat, Hassan rue tanger 201", InternalRetailerCode = "InternalCodetestRaji", ExternalRetailerCode = "ExternalCodetestRaji",
            //    Activity = "Activitytest", WeeklySalesLimit = 14650, AnnualCA = 15054500, TotalCommissions = 36200,
            //    TotalUnpaid = 26590, ContractNumber = "0636148596", CompanyIdentifier = "CompanyIdentifiertest", GeographicSector = "GeographicSectortest",
            //    CurrentBalance = 1500, AdressLatitude = 154.2696578, AdressLongitude = 249.6597866, City = "Rabat"
            //},
        };

        public static Dictionary<string, List<string>> AdministrationRequestCategoriesAndObjects = new Dictionary<string, List<string>>()
        {
            {
                "Demandes du Détaillant", new List<string>()
                {
                    "Changement de local commercial",
                    "Régularisation suite au décés du propriétaire",
                    "Régularisation suite à la vente du magasin",
                    "Demande de désinstallation",
                    "Attestation de CA",
                    "Attestation de cessation d'activité",
                    "Demande d'ouverture d'un autre pdv",
                    "Demande de gérance libre d'un magasin LOR",
                    "Demande de résiliation",
                    "Demande de changement Ordre Prélévement",
                    "Autre Demande"
                }
            }
        };
        public static Dictionary<string, List<string>> TechnicalRequestCategoriesAndObjects = new Dictionary<string, List<string>>()
        {
            {
                "Installation/Désinstallation Equipements", new List<string>()
                {
                    "Demande de Formation",
                    "Demande d'installation",
                    "Demande de désinstallation totale",
                    "Demande de désinstallation partielle",
                    "Demande de rebranchement",
                    "Demande de TV Virtuel",
                    "Demande de TV Keno",
                    "Demande de Terminal",
                    "Demande de Machines BINGA",
                    "Demande de tablette",
                    "Autre Equipement",
                }
            },
            {
                "Terminal POS", new List<string>()
                {
                    "Terminal ne demarre pas",
                    "Casse du terminal par le joueur",
                    "Calibrage écran tactile",
                    "Terminal bloqué sur le Logo SISAL",
                    "Message d'erreur",
                    "Scanner ne lit pas les Tickets",
                    "Scanner ne fonctionne pas",
                    "Ticket de jeu avec rayures blanches",
                    "Problème de connexion-cable Ethernet",
                    "Cable USB",
                    "Cable modem",
                    "Ticket Checker désactivé",
                    "Panne Ticket Checker",
                    "Cache du Terminal cassé",
                    "Panne Ecran joueurs CUDI",
                    "Autre panne"
                }
            },
            {
                "Ecran TV", new List<string>()
                {
                    "Panne TV Keno",
                    "Panne TV Jeux Virtuels"
                }
            },
            {
                "Machine BINGA", new List<string>()
                {
                    "Panne Machine Binga",
                    "Panne Cashdesk"
                }
            },
            {
                "Tablette", new List<string>()
                {
                    "Panne Tablette"
                }
            },
            {
                "Récepteur/Parabole", new List<string>()
                {
                    "Probléme de signal",
                    "Récepteur en panne"
                }
            },
            {
                "Réseau TELECOM", new List<string>()
                {
                    "Connexion interrompue",
                    "Connexion lente",
                    "Demande connexion ADSL",
                    "Demande de connexion 4G/5G",
                    "Autre Demande"
                }
            },
            {
                "Call Center", new List<string>()
                {
                    "Injoignable",
                    "Temps de réponse Trop long",
                    "Comportement non professionnel de l'agent",
                    "Demande d'augmentation de la limite de vente",
                    "Autre information"
                }
            }
        };
        public static Dictionary<string, List<string>> SalesRequestCategoriesAndObjects = new Dictionary<string, List<string>>()
        {
            {
                "Consommables Jeux", new List<string>()
                {
                    "Rupture de rouleaux thermiques Terminal",
                    "Rupture de rouleaux thermiques Machine BINGA",
                    "Rupture de coupons LOTO/JOKER",
                    "Rupture de coupons KENO",
                    "Rupture de coupons QUATRO",
                    "Rupture de coupons LMATCH",
                    "Rupture de coupons LMATCH PRO",
                    "Rupture de coupons SLOOG",
                    "Rupture de coupons PICALA",
                    "Rupture de coupons RALLYE",
                    "Rupture de coupons GAGNANT A VIE",
                    "Rupture de coupons PNP CHAINE A 4",
                    "Rupture de coupons PNP NEW YORK 5",
                    "Rupture de coupons PNP PARIS 7",
                    "Rupture de coupons PNP ALADIN",
                    "Rupture de coupons PNP BALLOON",
                    "Rupture de coupons PNP BILLARD",
                    "Rupture de coupons PNP MAGIC BOULES",
                    "Rupture de coupons PNP KENO PLUS",
                    "Rupture de coupons PNP LOTO PLUS",
                    "Rupture de coupons PNP CASABLANCA 9",
                    "Rupture de coupons PNP MARRAKECH",
                    "Rupture de coupons PNP BARCELONE 10",
                    "Rupture de coupons PNP MILAN 2",
                    "Rupture de coupons PNP MADRID 1",
                    "Autre Rupture"
                }
            },
            {
                "Scratch", new List<string>()
                {
                    "Rupture Tickets de Jeu 5 W KHMISS",
                    "Rupture Tickets de Jeu AFOUSS",
                    "Rupture Tickets de Jeu LOUBANE",
                    "Rupture Tickets de Jeu LOUIZE",
                    "Rupture Tickets de Jeu PILE OU FACE",
                    "Autre Rupture"
                }
            },
            {
                "Supports et PLV", new List<string>()
                {
                    "Demande d'Enseigne Extérieure",
                    "Demande de Présentoir JEUX",
                    "Demande de Présentoir SCRATCH",
                    "Demande de Présentoir Pick N Play",
                    "Demande de Présentoir Jeux Virtuels",
                    "Demande de Porte Affiches",
                    "Demande de support Jackpot LOTO",
                    "Demande d'affiches Pub Jeux",
                    "Demande de Coin Joueur",
                    "Demande de Bache",
                    "Demande de Caméras de Surveillance",
                    "Demande d'aménagement nouveau Détaillant",
                    "Demande d'aménagement Détaillant existant",
                    "Demande de séparateurs BINGA",
                    "Demande de Tabourets  BINGA"
                }
            },
            {
                "RSE et Jeu Responsable", new List<string>()
                {
                    "Demande de formation RSE",
                    "Demande de formation Jeu Responsable",
                    "Demande d'affiches RSE",
                    "Demande d'affiches Jeu Responsable",
                    "Autre Demande"
                }
            }
        };

    }
}