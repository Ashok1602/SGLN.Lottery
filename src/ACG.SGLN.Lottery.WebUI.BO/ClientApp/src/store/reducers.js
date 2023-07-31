import { reducer as form } from "redux-form"; // SAYING use redux form reducer as reducer
import { combineReducers } from "redux";
// Front
import Layout from "./layout/reducer";
import Loader from "./layout/loader/reducer";
// Authentication
import Login from "./auth/login/reducer";
// Resource
import Resource from "./resource/reducer";
// Announcement
import Announcement from "./announcements/reducer";
// Users
import Users from "./users/reducer";
// Requests
import Requests from "./requests/reducer";
// role
import Role from "./role/reducer";
// Request Comment
import RequestComment from "./requestComments/reducer";
// Application Settings
import ApplicationSettings from "./applicationSettings/reducer";
// Documents
import Documents from "./documents/reducer";
// Notification
import Notification from "./notifications/reducer";
// Notification
import Retailer from "./retailer/reducer";
// Trainings
import Trainings from "./trainings/reducer";
// Training Modules
import TrainingModule from "./trainingModules/reducer";
// report Modules
import ReportModule from "./report/reducer";
// incentives Modules
import IncentivesModule from "./incentive/reducer";
//Request Category
import RequestCategory from "./requestCategory/reducer";

const rootReducer = combineReducers({
  // public
  form,
  Layout,
  Loader,
  Login,
  Resource,
  Announcement,
  Users,
  Requests,
  Role,
  RequestComment,
  ApplicationSettings,
  Documents,
  Notification,
  Retailer,
  Trainings,
  TrainingModule,
  ReportModule,
  IncentivesModule,
  RequestCategory
});

export default rootReducer;
