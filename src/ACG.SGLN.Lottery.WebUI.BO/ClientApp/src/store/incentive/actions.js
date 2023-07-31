import {
  GET_INCENTIVES,
  GET_INCENTIVES_SUCCESS,
  GET_INCENTIVES_FAILURE,
} from "./actionTypes";

//get Incentives list
export const getIncentive = (payload) => {
  return {
    type: GET_INCENTIVES,
    payload: payload,
  };
};

export const getIncentiveSuccess = (response) => {
  return {
    type: GET_INCENTIVES_SUCCESS,
    payload: response,
  };
};

export const getIncentiveFailure = (error) => {
  return {
    type: GET_INCENTIVES_FAILURE,
    payload: error,
  };
};
