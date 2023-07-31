import { all } from "redux-saga/effects";

//public
import AuthSaga from "./auth/login/saga";
import LayoutSaga from "./layout/saga";
import ResourceSega from "./resource/saga";
import Announcement from "./announcements/saga";
import usersSaga from "./users/saga";
import requestsSaga from "./requests/saga";
import RoleSaga from "./role/saga";
import RequestCommentSega from "./requestComments/saga";
import applicationSettingsSega from "./applicationSettings/saga";
import docsSega from "./documents/saga";
import notificationSega from "./notifications/saga";
import retailerSega from "./retailer/saga";
import trainingsSega from "./trainings/saga";
import trainingModulesSega from "./trainingModules/saga";
import reportSaga from "./report/saga";
import incentiveSaga from "./incentive/saga";
import requestCategory from "./requestCategory/saga";

export default function* rootSaga() {
  yield all([
    //public
    AuthSaga(),
    LayoutSaga(),
    ResourceSega(),
    Announcement(),
    usersSaga(),
    RoleSaga(),
    requestsSaga(),
    RequestCommentSega(),
    applicationSettingsSega(),
    docsSega(),
    notificationSega(),
    retailerSega(),
    trainingsSega(),
    trainingModulesSega(),
    reportSaga(),
    incentiveSaga(),
    requestCategory(),
  ]);
}
