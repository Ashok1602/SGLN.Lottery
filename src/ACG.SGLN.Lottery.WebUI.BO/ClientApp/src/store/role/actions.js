import { GET_ROLE, GET_ROLE_SUCCESS, GET_ROLE_FAILURE } from "./actionTypes";

export const getRole = (payload) => {
  return {
    type: GET_ROLE,
    payload: payload,
  };
};

export const getRoleSuccess = (response) => {
  return {
    type: GET_ROLE_SUCCESS,
    payload: response,
  };
};

export const getRoleFailure = (error) => {
  return {
    type: GET_ROLE_FAILURE,
    payload: error,
  };
};
