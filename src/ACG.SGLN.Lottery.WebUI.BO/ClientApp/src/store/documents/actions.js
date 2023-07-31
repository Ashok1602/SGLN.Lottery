import {
  GET_DOCUMENTLIST,
  GET_DOCUMENTLIST_SUCCESS,
  GET_DOCUMENTLIST_FAILURE,
  UPLOAD_DOCUMENT,
  UPLOAD_DOCUMENT_SUCCESS,
  UPLOAD_DOCUMENT_FAILURE,
  DELETE_DOCUMENT,
  DELETE_DOCUMENT_SUCCESS,
  DELETE_DOCUMENT_FAILURE,
} from "./actionTypes";

export const getDocumentList = (payload) => {
  return {
    type: GET_DOCUMENTLIST,
    payload: payload,
  };
};

export const getDocumentListSuccess = (response) => {
  return {
    type: GET_DOCUMENTLIST_SUCCESS,
    payload: response,
  };
};

export const getDocumentListFailure = (error) => {
  return {
    type: GET_DOCUMENTLIST_FAILURE,
    payload: error,
  };
};


export const uploadDocument = (formData) => {
  return {
    type: UPLOAD_DOCUMENT,
    payload: formData,
  };
};
export const uploadDocumentSuccess = (response) => {
  return {
    type: UPLOAD_DOCUMENT_SUCCESS,
    payload: response,
  };
};
export const uploadDocumentFailure = (error) => {
  return {
    type: UPLOAD_DOCUMENT_FAILURE,
    payload: error,
  };
};

export const deleteDocument = (data) => {
  return {
    type: DELETE_DOCUMENT,
    payload: data,
  };
};
export const deleteDocumentSuccess = (response) => {
  return {
    type: DELETE_DOCUMENT_SUCCESS,
    payload: response,
  };
};
export const deleteDocumentFailure = (error) => {
  return {
    type: DELETE_DOCUMENT_FAILURE,
    payload: error,
  };
};
