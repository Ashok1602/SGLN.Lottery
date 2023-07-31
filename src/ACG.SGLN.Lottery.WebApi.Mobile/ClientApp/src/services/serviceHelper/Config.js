/* eslint-disable prettier/prettier */
import axios from 'axios';
import {
  AuthClient,
  ResourcesClient,
  RequestsClient,
  UsersClient,
  RequestObjectsClient,
  DocumentsClient,
  AnnouncementsClient,
  TrainingsClient,
  TrainingModulesClient,
  RetailersClient,
  OfficialDocumentsClient,
  NotificationsClient,
  InvoicesClient,
  ExcellenceProgramsClient,
} from '../../ACG.SGLN.Lottery-api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// creating global instance for the axios to call apis
export const AXIOS_INSTANCE = axios.create({
  headers: {'Access-Control-Allow-Origin': '*'},
});

// base url
export const DEVELOPMENT_BASE_URL =
  'https://sglnlottery-mob-ws.azurewebsites.net';

//Testing url
export const TESTING_URL = 'https://sglnlottery-mob-ws-test.azurewebsites.net';

export const BASE_URL = DEVELOPMENT_BASE_URL;

//Todo bearer token
export const GET_AXIOS_INSTANCE = () => {
  AsyncStorage.getItem('bearerToken').then(value => {
    if (value !== null) {
      AXIOS_INSTANCE.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${value}`;
    }
  });
};

GET_AXIOS_INSTANCE();

//auth client
export const AUTH_CLIENT = new AuthClient(BASE_URL, AXIOS_INSTANCE);

//resource client
export const RESOURCE_CLIENT = new ResourcesClient(BASE_URL, AXIOS_INSTANCE);

//resource client
export const REQUEST_OBJECT_CLIENT = new RequestObjectsClient(
  BASE_URL,
  AXIOS_INSTANCE,
);

//Create Request client

export const REQUESTCLIENT = new RequestsClient(BASE_URL, AXIOS_INSTANCE);

export const USERSCLIENT = new UsersClient(BASE_URL, AXIOS_INSTANCE);

// announcement client
export const ANNOUNCEMENT_CLIENT = new AnnouncementsClient(
  BASE_URL,
  AXIOS_INSTANCE,
);

export const DOCUMENTCLIENT = new DocumentsClient(BASE_URL, AXIOS_INSTANCE);

export const OFF_DOCUMENTCLIENT = new OfficialDocumentsClient(
  BASE_URL,
  AXIOS_INSTANCE,
);

export const TRAINING = new TrainingsClient(BASE_URL, AXIOS_INSTANCE);
export const INT_TRAINING = new TrainingModulesClient(BASE_URL, AXIOS_INSTANCE);
export const RETAILERSCLIENT = new RetailersClient(BASE_URL, AXIOS_INSTANCE);
export const NOTIFICATION = new NotificationsClient(BASE_URL, AXIOS_INSTANCE);
export const INVOICE_CLIENT = new InvoicesClient(BASE_URL, AXIOS_INSTANCE);
export const INCENTIVE_CLIENT = new ExcellenceProgramsClient(BASE_URL, AXIOS_INSTANCE);
