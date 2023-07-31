import {NOTIFICATION_CONSTANTS} from './notification-constant';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case NOTIFICATION_CONSTANTS.NEW_NOTIFICATION:
      return {
        ...state,
        NotificationForeground: action.payload,
        Notification: null,
      };
    default:
      return state;
  }
}
