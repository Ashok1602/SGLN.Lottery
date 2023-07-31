import axios from "axios";
import {
  AuthClient,
  ResourcesClient,
  AnnouncementsClient,
  UsersClient,
  RequestsClient,
  RolesClient,
  RequestObjectsClient,
  RequestCommentsClient,
  SupportDocumentsClient,
  DocumentsClient,
  NotificationsClient,
  RetailersClient,
  TrainingsClient,
  TrainingModulesClient,
  ReportingClient,
  ExcellenceProgramsClient,
  RequestCategoriesClient
} from "../ACG.SGLN.Lottery-api";

// base url
export const BASE_URL = `${process.env.REACT_APP_API_URL}`;

// creating global instance for the axios to call apis
export const AXIOS_INSTANCE = axios.create({
  headers: { "Access-Control-Allow-Origin": "*" },
});

export const GET_AXIOS_INSTANCE = () => {
  if (localStorage.getItem("loginInfo")) {
    const token = JSON.parse(localStorage.getItem("loginInfo")).data
      .accessToken;
    AXIOS_INSTANCE.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

GET_AXIOS_INSTANCE();

//auth client
export const AUTH_CLIENT = new AuthClient(BASE_URL, AXIOS_INSTANCE);

//resource client
export const RESOURCE_CLIENT = new ResourcesClient(BASE_URL, AXIOS_INSTANCE);

//announcement client
export const ANNOUNCEMENT_CLIENT = new AnnouncementsClient(
  BASE_URL,
  AXIOS_INSTANCE
);

//users client
export const USERS_CLIENT = new UsersClient(BASE_URL, AXIOS_INSTANCE);

//requests client
export const REQUESTS_CLIENT = new RequestsClient(BASE_URL, AXIOS_INSTANCE);

//role client
export const ROLE_CLIENT = new RolesClient(BASE_URL, AXIOS_INSTANCE);

//request comment client
export const REQUETS_COMMENT_CLIENT = new RequestCommentsClient(
  BASE_URL,
  AXIOS_INSTANCE
);

//application setting client
export const REQUEST_OBJECT_CLIENT = new RequestObjectsClient(
  BASE_URL,
  AXIOS_INSTANCE
);

// Support Document client
export const SUPPORT_DOCS_CLIENT = new SupportDocumentsClient(
  BASE_URL,
  AXIOS_INSTANCE
);

// Documents client
export const DOCUMENTS_CLIENT = new DocumentsClient(BASE_URL, AXIOS_INSTANCE);
//Notifications client
export const NOTIFICATION_CLIENT = new NotificationsClient(
  BASE_URL,
  AXIOS_INSTANCE
);

//Retailer client
export const RETAILER_CLIENT = new RetailersClient(BASE_URL, AXIOS_INSTANCE);

//Trainings client
export const TRAININGS_CLIENT = new TrainingsClient(BASE_URL, AXIOS_INSTANCE);

//Training modules client
export const TRAINING_MODULES_CLIENT = new TrainingModulesClient(
  BASE_URL,
  AXIOS_INSTANCE
);

//Training modules client
export const REPORT_MODULES_CLIENT = new ReportingClient(
  BASE_URL,
  AXIOS_INSTANCE
);

//Incentive modules client
export const INCENTIVE_CLIENT = new ExcellenceProgramsClient(
  BASE_URL,
  AXIOS_INSTANCE
);

//Request Category client
export const REQUEST_CATEGORY_CLIENT = new RequestCategoriesClient(
  BASE_URL,
  AXIOS_INSTANCE
);