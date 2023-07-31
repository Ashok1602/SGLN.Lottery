import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_USER,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
} from './actionTypes';

export const loginUser = (formData) => {
  return {
    type: LOGIN_USER,
    payload: formData,
  };
};

export const loginSuccess = (response) => {
  return {
    type: LOGIN_SUCCESS,
    payload: response,
  };
};

export const loginFailure = (error) => {
  return {
    type: LOGIN_FAILURE,
    payload: error,
  };
};

export const logoutUser = (formData) => {
    return {
      type: LOGOUT_USER,
      payload: formData,
    };
  };
  
  export const logoutUserSuccess = (response) => {
    return {
      type: LOGOUT_SUCCESS,
      payload: response,
    };
  };
  
  export const logoutUserFailure = (error) => {
    return {
      type: LOGOUT_FAILURE,
      payload: error,
    };
  };
  