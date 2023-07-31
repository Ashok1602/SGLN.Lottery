import {
  GET_RESOURCE,
  RESOURCE_SUCCESS,
  RESOURCE_FAILURE,
  GET_CATEGORIES_BY_NATURE,
  GET_CATEGORIES_BY_NATURE_SUCCESS,
  GET_CATEGORIES_BY_NATURE_FAILURE,
} from './actionTypes';

export const getResource = () => {
  return {
    type: GET_RESOURCE,
    payload: null,
  };
};

export const getResourceSuccess = (response) => {
  return {
    type: RESOURCE_SUCCESS,
    payload: response,
  };
};

export const getResourceFailure = (error) => {
  return {
    type: RESOURCE_FAILURE,
    payload: error,
  };
};

export const getCategoriesByNature = (id) => {
    return {
      type: GET_CATEGORIES_BY_NATURE,
      payload: id,
    };
  };
  
  export const getCategoriesByNatureSuccess = (response) => {
    return {
      type: GET_CATEGORIES_BY_NATURE_SUCCESS,
      payload: response,
    };
  };
  
  export const getCategoriesByNatureFailure = (error) => {
    return {
      type: GET_CATEGORIES_BY_NATURE_FAILURE,
      payload: error,
    };
  }