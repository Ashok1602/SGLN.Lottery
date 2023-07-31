import {NOTIFICATION_CONSTANTS} from './notification-constant';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case NOTIFICATION_CONSTANTS.GET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        GetNotificationSuccess: action.payload,
        GetNotificationFail: null,
      };
    case NOTIFICATION_CONSTANTS.GET_NOTIFICATION_FAIL:
      return {
        ...state,
        GetNotificationSuccess: null,
        GetNotificationFail: action.payload,
      };
    default:
      return state;
  }
}
