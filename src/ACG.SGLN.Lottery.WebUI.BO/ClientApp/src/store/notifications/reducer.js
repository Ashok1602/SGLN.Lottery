import {
  GET_NOTIFICATION,
  GET_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_FAILURE,
  ADD_NOTIFICATION,
  ADD_NOTIFICATION_SUCCESS,
  ADD_NOTIFICATION_FAILURE,
  GET_NOTIFICATION_BY_ID,
  GET_NOTIFICATION_BY_ID_SUCCESS,
  GET_NOTIFICATION_BY_ID_FAILURE,
} from "./actionTypes";

const initialState = {
  data: null,
  createData: null,
  updateData: null,
  notificationData: null,
};

const notification = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_NOTIFICATION_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_NOTIFICATION_FAILURE:
      state = { ...state, data: null };
      break;
    //create notification case
    case ADD_NOTIFICATION:
      state = {
        ...state,
        createData: null,
      };
      break;
    case ADD_NOTIFICATION_SUCCESS:
      state = {
        ...state,
        createData: action.payload,
      };
      break;
    case ADD_NOTIFICATION_FAILURE:
      state = {
        ...state,
        createData: null,
      };
      break;
    //get notification by id case
    case GET_NOTIFICATION_BY_ID:
      state = {
        ...state,
        notificationDataById: null,
      };
      break;
    case GET_NOTIFICATION_BY_ID_SUCCESS:
      state = {
        ...state,
        notificationDataById: action.payload,
      };
      break;
    case GET_NOTIFICATION_BY_ID_FAILURE:
      state = {
        ...state,
        notificationDataById: null,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default notification;
