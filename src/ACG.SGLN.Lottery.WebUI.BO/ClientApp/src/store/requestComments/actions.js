import {
  GET_REQUESTS_COMMENT,
  GET_REQUESTS_COMMENT_SUCCESS,
  GET_REQUESTS_COMMENT_FAILURE,
  GET_REQUESTS_COMMENT_BY_ID,
  GET_REQUESTS_COMMENT_BY_ID_SUCCESS,
  GET_REQUESTS_COMMENT_BY_ID_FAILURE,
  CREATE_REQUESTS_COMMENT,
  CREATE_REQUESTS_COMMENT_SUCCESS,
  CREATE_REQUESTS_COMMENT_FAILURE,
  DELETE_REQUESTS_COMMENT,
  DELETE_REQUESTS_COMMENT_SUCCESS,
  DELETE_REQUESTS_COMMENT_FAILURE
} from './actionTypes';

export const getRequestComment = (formData) => {
  return {
    type: GET_REQUESTS_COMMENT,
    payload: formData,
  };
};

export const getRequestCommentSuccess = (response) => {
  return {
    type: GET_REQUESTS_COMMENT_SUCCESS,
    payload: response,
  };
};

export const getRequestCommentsFailure = (error) => {
  return {
    type: GET_REQUESTS_COMMENT_FAILURE,
    payload: error,
  };
};

export const getRequestCommentById = (id) => {
  return {
    type: GET_REQUESTS_COMMENT_BY_ID,
    payload: id,
  };
};

export const getRequestCommentByIdSuccess = (response) => {
  return {
    type: GET_REQUESTS_COMMENT_BY_ID_SUCCESS,
    payload: response,
  };
};

export const getRequestCommentByIdFailure = (error) => {
  return {
    type: GET_REQUESTS_COMMENT_BY_ID_FAILURE,
    payload: error,
  };
};

export const createRequestComment = (data) => {
  return {
    type: CREATE_REQUESTS_COMMENT,
    payload: data,
  };
};

export const createRequestCommentSuccess = (response) => {
  return {
    type: CREATE_REQUESTS_COMMENT_SUCCESS,
    payload: response,
  };
};

export const createRequestCommentFailure = (error) => {
  return {
    type: CREATE_REQUESTS_COMMENT_FAILURE,
    payload: error,
  };
};

export const deleteRequestComment = (formData) => {
  return {
    type: DELETE_REQUESTS_COMMENT,
    payload: formData,
  };
};

export const deleteRequestCommentSuccess = (response) => {
  return {
    type: DELETE_REQUESTS_COMMENT_SUCCESS,
    payload: response,
  };
};

export const deleteRequestCommentFailure = (error) => {
  return {
    type: DELETE_REQUESTS_COMMENT_FAILURE,
    payload: error,
  };
};
