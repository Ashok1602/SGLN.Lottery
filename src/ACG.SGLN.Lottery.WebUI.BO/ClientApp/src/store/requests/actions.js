import {
  GET_REQUESTS,
  GET_REQUESTS_SUCCESS,
  GET_REQUESTS_FAILURE,
  GET_REQUESTS_BY_ID,
  GET_REQUESTS_BY_ID_SUCCESS,
  GET_REQUESTS_BY_ID_FAILURE,
  START_REQUESTS,
  START_REQUESTS_SUCCESS,
  START_REQUESTS_FAILURE,
  CLOSE_REQUESTS,
  CLOSE_REQUESTS_SUCCESS,
  CLOSE_REQUESTS_FAILURE,
  ASSIGN_REQUESTS,
  ASSIGN_REQUESTS_SUCCESS,
  ASSIGN_REQUESTS_FAILURE,
} from "./actionTypes";

export const getRequests = (formData) => {
  return {
    type: GET_REQUESTS,
    payload: formData,
  };
};

export const getRequestsSuccess = (response) => {
  return {
    type: GET_REQUESTS_SUCCESS,
    payload: response,
  };
};

export const getRequestsFailure = (error) => {
  return {
    type: GET_REQUESTS_FAILURE,
    payload: error,
  };
};

export const getRequestById = (id) => {
  return {
    type: GET_REQUESTS_BY_ID,
    payload: id,
  };
};

export const getRequestByIdSuccess = (response) => {
  return {
    type: GET_REQUESTS_BY_ID_SUCCESS,
    payload: response,
  };
};

export const getRequestByIdFailure = (error) => {
  return {
    type: GET_REQUESTS_BY_ID_FAILURE,
    payload: error,
  };
};

export const startRequest = (id) => {
  return {
    type: START_REQUESTS,
    payload: id,
  };
};

export const startRequestSuccess = (response) => {
  return {
    type: START_REQUESTS_SUCCESS,
    payload: response,
  };
};

export const startRequestFailure = (error) => {
  return {
    type: START_REQUESTS_FAILURE,
    payload: error,
  };
};

export const closeRequest = (formData) => {
  return {
    type: CLOSE_REQUESTS,
    payload: formData,
  };
};

export const closeRequestSuccess = (response) => {
  return {
    type: CLOSE_REQUESTS_SUCCESS,
    payload: response,
  };
};

export const closeRequestFailure = (error) => {
  return {
    type: CLOSE_REQUESTS_FAILURE,
    payload: error,
  };
};

//assign request
export const assignRequest = (formData) => {
  return {
    type: ASSIGN_REQUESTS,
    payload: formData,
  };
};

export const assignRequestSuccess = (response) => {
  return {
    type: ASSIGN_REQUESTS_SUCCESS,
    payload: response,
  };
};

export const assignRequestFailure = (error) => {
  return {
    type: ASSIGN_REQUESTS_FAILURE,
    payload: error,
  };
};
