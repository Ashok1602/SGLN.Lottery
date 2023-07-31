import {
  GET_ANNOUNCEMENT,
  GET_ANNOUNCEMENT_SUCCESS,
  GET_ANNOUNCEMENT_FAILURE,
  ADD_ANNOUNCEMENT,
  ADD_ANNOUNCEMENT_SUCCESS,
  ADD_ANNOUNCEMENT_FAILURE,
  UPDATE_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  PUBLISH_ANNOUNCEMENT,
  UNPUBLISH_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT_SUCCESS,
  UPDATE_ANNOUNCEMENT_FAILURE,
  DELETE_ANNOUNCEMENT_SUCCESS,
  DELETE_ANNOUNCEMENT_FAILURE,
  PUBLISH_ANNOUNCEMENT_SUCCESS,
  PUBLISH_ANNOUNCEMENT_FAILURE,
  UNPUBLISH_ANNOUNCEMENT_SUCCESS,
  UNPUBLISH_ANNOUNCEMENT_FAILURE,
} from "./actionTypes";

export const getAnnouncement = (payload) => {
  return {
    type: GET_ANNOUNCEMENT,
    payload: payload,
  };
};

export const getAnnouncementSuccess = (response) => {
  return {
    type: GET_ANNOUNCEMENT_SUCCESS,
    payload: response,
  };
};

export const getAnnouncementFailure = (error) => {
  return {
    type: GET_ANNOUNCEMENT_FAILURE,
    payload: error,
  };
};


export const addAnnouncement = (formData) => {
  return {
    type: ADD_ANNOUNCEMENT,
    payload: formData,
  };
};
export const addAnnouncementSuccess = (response) => {
  return {
    type: ADD_ANNOUNCEMENT_SUCCESS,
    payload: response,
  };
};
export const addAnnouncementFailure = (error) => {
  return {
    type: ADD_ANNOUNCEMENT_FAILURE,
    payload: error,
  };
};

export const updateAnnouncement = (response) => {
  return {
    type: UPDATE_ANNOUNCEMENT,
    payload: response,
  };
};
export const updateAnnouncementSuccess = (response) => {
  return {
    type: UPDATE_ANNOUNCEMENT_SUCCESS,
    payload: response,
  };
};
export const updateAnnouncementFailure = (error) => {
  return {
    type: UPDATE_ANNOUNCEMENT_FAILURE,
    payload: error,
  };
};
export const deleteAnnouncement = (response) => {
  return {
    type: DELETE_ANNOUNCEMENT,
    payload: response,
  };
};
export const deleteAnnouncementSuccess = (response) => {
  return {
    type: DELETE_ANNOUNCEMENT_SUCCESS,
    payload: response,
  };
};
export const deleteAnnouncementFailure = (error) => {
  return {
    type: DELETE_ANNOUNCEMENT_FAILURE,
    payload: error,
  };
};
export const publishAnnouncement = (response) => {
  return {
    type: PUBLISH_ANNOUNCEMENT,
    payload: response,
  };
};
export const publishAnnouncementSuccess = (response) => {
  return {
    type: PUBLISH_ANNOUNCEMENT_SUCCESS,
    payload: response,
  };
};
export const publishAnnouncementFailure = (error) => {
  return {
    type: PUBLISH_ANNOUNCEMENT_FAILURE,
    payload: error,
  };
};
export const unPublishAnnouncement = (response) => {
  return {
    type: UNPUBLISH_ANNOUNCEMENT,
    payload: response,
  };
};
export const unPublishAnnouncementSuccess = (response) => {
  return {
    type: UNPUBLISH_ANNOUNCEMENT_SUCCESS,
    payload: response,
  };
};
export const unPublishAnnouncementFailure = (error) => {
  return {
    type: UNPUBLISH_ANNOUNCEMENT_FAILURE,
    payload: error,
  };
};
