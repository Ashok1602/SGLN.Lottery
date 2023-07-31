import {
  GET_TRAININGS,
  GET_TRAININGS_SUCCESS,
  GET_TRAININGS_FAILURE,
  GET_BY_ID_TRAINING,
  GET_BY_ID_TRAINING_SUCCESS,
  GET_BY_ID_TRAINING_FAILURE,
  ADD_VIDEO_TRAINING,
  ADD_VIDEO_TRAINING_SUCCESS,
  ADD_VIDEO_TRAINING_FAILURE,
  EDIT_VIDEO_TRAINING,
  EDIT_VIDEO_TRAINING_SUCCESS,
  EDIT_VIDEO_TRAINING_FAILURE,
  ADD_LIVE_TRAINING,
  ADD_LIVE_TRAINING_SUCCESS,
  ADD_LIVE_TRAINING_FAILURE,
  EDIT_LIVE_TRAINING,
  EDIT_LIVE_TRAINING_SUCCESS,
  EDIT_LIVE_TRAINING_FAILURE,
  PUBLISH_TRAINING,
  PUBLISH_TRAINING_SUCCESS,
  PUBLISH_TRAINING_FAILURE,
  UNPUBLISH_TRAINING,
  UNPUBLISH_TRAINING_SUCCESS,
  UNPUBLISH_TRAINING_FAILURE,
  ADD_INTERACTIVE_TRAINING,
  ADD_INTERACTIVE_TRAINING_SUCCESS,
  ADD_INTERACTIVE_TRAINING_FAILURE,
  GET_QUESTIONS_BY_ID,
  GET_QUESTIONS_BY_ID_SUCCESS,
  GET_QUESTIONS_BY_ID_FAILURE,
  GET_TRAINING_SLIDES_BY_ID,
  GET_TRAINING_SLIDES_BY_ID_SUCCESS,
  GET_TRAINING_SLIDES_BY_ID_FAILURE,
  EDIT_INTERACTIVE_TRAINING,
  EDIT_INTERACTIVE_TRAINING_SUCCESS,
  EDIT_INTERACTIVE_TRAINING_FAILURE,
} from "./actionTypes";

export const getTrainings = (payload) => {
  return {
    type: GET_TRAININGS,
    payload: payload,
  };
};

export const getTrainingsSuccess = (response) => {
  return {
    type: GET_TRAININGS_SUCCESS,
    payload: response,
  };
};

export const getTrainingsFailure = (error) => {
  return {
    type: GET_TRAININGS_FAILURE,
    payload: error,
  };
};

export const getTrainingById = (payload) => {
  return {
    type: GET_BY_ID_TRAINING,
    payload: payload,
  };
};

export const getTrainingByIdSuccess = (response) => {
  return {
    type: GET_BY_ID_TRAINING_SUCCESS,
    payload: response,
  };
};

export const getTrainingByIdFailure = (error) => {
  return {
    type: GET_BY_ID_TRAINING_FAILURE,
    payload: error,
  };
};

export const addVideoTraining = (formData) => {
  return {
    type: ADD_VIDEO_TRAINING,
    payload: formData,
  };
};
export const addVideoTrainingSuccess = (response) => {
  return {
    type: ADD_VIDEO_TRAINING_SUCCESS,
    payload: response,
  };
};
export const addVideoTrainingFailure = (error) => {
  return {
    type: ADD_VIDEO_TRAINING_FAILURE,
    payload: error,
  };
};

export const editVideoTraining = (formData) => {
  return {
    type: EDIT_VIDEO_TRAINING,
    payload: formData,
  };
};
export const editVideoTrainingSuccess = (response) => {
  return {
    type: EDIT_VIDEO_TRAINING_SUCCESS,
    payload: response,
  };
};
export const editVideoTrainingFailure = (error) => {
  return {
    type: EDIT_VIDEO_TRAINING_FAILURE,
    payload: error,
  };
};

export const addLiveTraining = (formData) => {
  return {
    type: ADD_LIVE_TRAINING,
    payload: formData,
  };
};
export const addLiveTrainingSuccess = (response) => {
  return {
    type: ADD_LIVE_TRAINING_SUCCESS,
    payload: response,
  };
};
export const addLiveTrainingFailure = (error) => {
  return {
    type: ADD_LIVE_TRAINING_FAILURE,
    payload: error,
  };
};

export const editLiveTraining = (formData) => {
  return {
    type: EDIT_LIVE_TRAINING,
    payload: formData,
  };
};
export const editLiveTrainingSuccess = (response) => {
  return {
    type: EDIT_LIVE_TRAINING_SUCCESS,
    payload: response,
  };
};
export const editLiveTrainingFailure = (error) => {
  return {
    type: EDIT_LIVE_TRAINING_FAILURE,
    payload: error,
  };
};

export const publishTraining = (formData) => {
  return {
    type: PUBLISH_TRAINING,
    payload: formData,
  };
};
export const publishTrainingSuccess = (response) => {
  return {
    type: PUBLISH_TRAINING_SUCCESS,
    payload: response,
  };
};
export const publishTrainingFailure = (error) => {
  return {
    type: PUBLISH_TRAINING_FAILURE,
    payload: error,
  };
};

export const unPublishTraining = (formData) => {
  return {
    type: UNPUBLISH_TRAINING,
    payload: formData,
  };
};
export const unPublishTrainingSuccess = (response) => {
  return {
    type: UNPUBLISH_TRAINING_SUCCESS,
    payload: response,
  };
};
export const unPublishTrainingFailure = (error) => {
  return {
    type: UNPUBLISH_TRAINING_FAILURE,
    payload: error,
  };
};

// add interactive training
export const addInteractiveTraining = (formData) => {
  return {
    type: ADD_INTERACTIVE_TRAINING,
    payload: formData,
  };
};
export const addInteractiveTrainingSuccess = (response) => {
  return {
    type: ADD_INTERACTIVE_TRAINING_SUCCESS,
    payload: response,
  };
};
export const addInteractiveTrainingFailure = (error) => {
  return {
    type: ADD_INTERACTIVE_TRAINING_FAILURE,
    payload: error,
  };
};

// update interactive training
export const updateInteractiveTraining = (formData) => {
  return {
    type: EDIT_INTERACTIVE_TRAINING,
    payload: formData,
  };
};
export const updateInteractiveTrainingSuccess = (response) => {
  return {
    type: EDIT_INTERACTIVE_TRAINING_SUCCESS,
    payload: response,
  };
};
export const updateInteractiveTrainingFailure = (error) => {
  return {
    type: EDIT_INTERACTIVE_TRAINING_FAILURE,
    payload: error,
  };
};

// get interactive training questions
export const getTrainingQuestionsById = (formData) => {
  return {
    type: GET_QUESTIONS_BY_ID,
    payload: formData,
  };
};
export const getTrainingQuestionsByIdSuccess = (response) => {
  return {
    type: GET_QUESTIONS_BY_ID_SUCCESS,
    payload: response,
  };
};
export const getTrainingQuestionsByIdFailure = (error) => {
  return {
    type: GET_QUESTIONS_BY_ID_FAILURE,
    payload: error,
  };
};
// get interactive training slides
export const getTrainingSlidesById = (formData) => {
  return {
    type: GET_TRAINING_SLIDES_BY_ID,
    payload: formData,
  };
};
export const getTrainingSlidesByIdSuccess = (response) => {
  return {
    type: GET_TRAINING_SLIDES_BY_ID_SUCCESS,
    payload: response,
  };
};
export const getTrainingSlidesByIdFailure = (error) => {
  return {
    type: GET_TRAINING_SLIDES_BY_ID_FAILURE,
    payload: error,
  };
};
