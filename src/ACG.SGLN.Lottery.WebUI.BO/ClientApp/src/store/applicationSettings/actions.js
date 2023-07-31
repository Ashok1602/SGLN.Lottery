import {
  GET_APPLICATION_SETTING,
  GET_APPLICATION_SETTING_SUCCESS,
  GET_APPLICATION_SETTING_FAILURE,
  ADD_APPLICATION_SETTING,
  ADD_APPLICATION_SETTING_SUCCESS,
  ADD_APPLICATION_SETTING_FAILURE,
  UPDATE_APPLICATION_SETTING,
  UPDATE_APPLICATION_SETTING_SUCCESS,
  UPDATE_APPLICATION_SETTING_FAILURE,
  DELETE_APPLICATION_SETTING,
  DELETE_APPLICATION_SETTING_SUCCESS,
  DELETE_APPLICATION_SETTING_FAILURE,
  ACTIVATE_APPLICATION_SETTING,
  ACTIVATE_APPLICATION_SETTING_SUCCESS,
  ACTIVATE_APPLICATION_SETTING_FAILURE,
  INACTIVATE_APPLICATION_SETTING,
  INACTIVATE_APPLICATION_SETTING_SUCCESS,
  INACTIVATE_APPLICATION_SETTING_FAILURE
} from "./actionTypes";

export const getApplicationSettings = (payload) => {
  return {
    type: GET_APPLICATION_SETTING,
    payload: payload,
  };
};

export const getApplicationSettingsSuccess = (response) => {
  return {
    type: GET_APPLICATION_SETTING_SUCCESS,
    payload: response,
  };
};

export const getApplicationSettingsFailure = (error) => {
  return {
    type: GET_APPLICATION_SETTING_FAILURE,
    payload: error,
  };
};


export const addApplicationSettings = (formData) => {
  return {
    type: ADD_APPLICATION_SETTING,
    payload: formData,
  };
};
export const addApplicationSettingsSuccess = (response) => {
  return {
    type: ADD_APPLICATION_SETTING_SUCCESS,
    payload: response,
  };
};
export const addApplicationSettingsFailure = (error) => {
  return {
    type: ADD_APPLICATION_SETTING_FAILURE,
    payload: error,
  };
};

export const updateApplicationSettings = (response) => {
  return {
    type: UPDATE_APPLICATION_SETTING,
    payload: response,
  };
};
export const updateApplicationSettingsSuccess = (response) => {
  return {
    type: UPDATE_APPLICATION_SETTING_SUCCESS,
    payload: response,
  };
};
export const updateApplicationSettingsFailure = (error) => {
  return {
    type: UPDATE_APPLICATION_SETTING_FAILURE,
    payload: error,
  };
};
export const deleteApplicationSettings = (response) => {
  return {
    type: DELETE_APPLICATION_SETTING,
    payload: response,
  };
};
export const deleteApplicationSettingsSuccess = (response) => {
  return {
    type: DELETE_APPLICATION_SETTING_SUCCESS,
    payload: response,
  };
};
export const deleteApplicationSettingsFailure = (error) => {
  return {
    type: DELETE_APPLICATION_SETTING_FAILURE,
    payload: error,
  };
};
// Activate handler
export const activateApplicationSettings = (response) => {
  return {
    type: ACTIVATE_APPLICATION_SETTING,
    payload: response,
  };
};
export const activateApplicationSettingsSuccess = (response) => {
  return {
    type: ACTIVATE_APPLICATION_SETTING_SUCCESS,
    payload: response,
  };
};
export const activateApplicationSettingsFailure = (error) => {
  return {
    type: ACTIVATE_APPLICATION_SETTING_FAILURE,
    payload: error,
  };
};
// inActivate handler
export const inActivateApplicationSettings = (response) => {
  return {
    type: INACTIVATE_APPLICATION_SETTING,
    payload: response,
  };
};
export const inActivateApplicationSettingsSuccess = (response) => {
  return {
    type: INACTIVATE_APPLICATION_SETTING_SUCCESS,
    payload: response,
  };
};
export const inActivateApplicationSettingsFailure = (error) => {
  return {
    type: INACTIVATE_APPLICATION_SETTING_FAILURE,
    payload: error,
  };
};

