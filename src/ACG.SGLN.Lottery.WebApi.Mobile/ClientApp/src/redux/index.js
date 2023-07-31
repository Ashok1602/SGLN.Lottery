/* eslint-disable prettier/prettier */
import {combineReducers} from 'redux';

import ChangeBottomTabColor from './bottomTab/changeColor-reducer';
import Object from './object/object-reducer';
import Resources from './resources/resource-reducer';
import RequestAll from './request/request-reducer';
import User from './user/user-reducer';
import DrawerReducer from './draweTab/drawer-changeColor-reducer';
import CurrentUserDetails from './currentUser/currentUser-reducer';
import InteractiveFormationDetails from './interactiveTraining/InteractiveTraining-reducer';
import Notification from './notification/notification-reducer';
import NewNotification from './notification/newNotification-reducer';

const rootReducer = combineReducers({
  ChangeBottomTabColor: ChangeBottomTabColor,
  Object: Object,
  Notification: Notification,
  NewNotification: NewNotification,
  Resources: Resources,
  RequestAll: RequestAll,
  User: User,
  DrawerReducer: DrawerReducer,
  CurrentUserDetails: CurrentUserDetails,
  formationDetails: InteractiveFormationDetails,
});

export default rootReducer;
