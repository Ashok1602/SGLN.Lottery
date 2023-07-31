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

//get Notification action
export const getNotification = (payload) => {
  return {
    type: GET_NOTIFICATION,
    payload: payload,
  };
};

export const getNotificationSuccess = (response) => {
  return {
    type: GET_NOTIFICATION_SUCCESS,
    payload: response,
  };
};

export const getNotificationFailure = (error) => {
  return {
    type: GET_NOTIFICATION_FAILURE,
    payload: error,
  };
};
//get Notification by Id action
export const getNotificationById = (id) => {
  return {
    type: GET_NOTIFICATION_BY_ID,
    payload: id,
  };
};

export const getNotificationByIdSuccess = (response) => {
  return {
    type: GET_NOTIFICATION_BY_ID_SUCCESS,
    payload: response,
  };
};

export const getNotificationByIdFailure = (error) => {
  return {
    type: GET_NOTIFICATION_BY_ID_FAILURE,
    payload: error,
  };
};

// add notification action
export const addNotification = (formData) => {
  return {
    type: ADD_NOTIFICATION,
    payload: formData,
  };
};
export const addNotificationSuccess = (response) => {
  return {
    type: ADD_NOTIFICATION_SUCCESS,
    payload: response,
  };
};
export const addNotificationFailure = (error) => {
  return {
    type: ADD_NOTIFICATION_FAILURE,
    payload: error,
  };
};
