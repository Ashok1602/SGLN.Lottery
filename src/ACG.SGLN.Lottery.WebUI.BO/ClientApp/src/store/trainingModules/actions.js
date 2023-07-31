import {
  GET_STRIPPED_MODULES,
  GET_STRIPPED_MODULES_SUCCESS,
  GET_STRIPPED_MODULES_FAILURE,
  GET_TRAINING_MODULE,
  GET_TRAINING_MODULE_SUCCESS,
  GET_TRAINING_MODULE_FAILURE,
  CREATE_TRAINING_MODULE,
  CREATE_TRAINING_MODULE_SUCCESS,
  CREATE_TRAINING_MODULE_FAILURE,
  DELETE_TRAINING_MODULE,
  DELETE_TRAINING_MODULE_SUCCESS,
  DELETE_TRAINING_MODULE_FAILURE,
  GET_TRAINING_MODULE_BY_ID,
  GET_TRAINING_MODULE_BY_ID_SUCCESS,
  GET_TRAINING_MODULE_BY_ID_FAILURE,
} from "./actionTypes";

//get training Stripped modules
export const getStrippedModules = (filter) => {
  return {
    type: GET_STRIPPED_MODULES,
    payload: filter,
  };
};

export const getStrippedModulesSuccess = (response) => {
  return {
    type: GET_STRIPPED_MODULES_SUCCESS,
    payload: response,
  };
};

export const getStrippedModulesFailure = (error) => {
  return {
    type: GET_STRIPPED_MODULES_FAILURE,
    payload: error,
  };
};

//get training modules
export const getTrainingModules = (filter) => {
  return {
    type: GET_TRAINING_MODULE,
    payload: filter,
  };
};

export const getTrainingModulesSuccess = (response) => {
  return {
    type: GET_TRAINING_MODULE_SUCCESS,
    payload: response,
  };
};

export const getTrainingModulesFailure = (error) => {
  return {
    type: GET_TRAINING_MODULE_FAILURE,
    payload: error,
  };
};

//create training modules
export const createTrainingModules = (formData) => {
  return {
    type: CREATE_TRAINING_MODULE,
    payload: formData,
  };
};

export const createTrainingModulesSuccess = (response) => {
  return {
    type: CREATE_TRAINING_MODULE_SUCCESS,
    payload: response,
  };
};

export const createTrainingModulesFailure = (error) => {
  return {
    type: CREATE_TRAINING_MODULE_FAILURE,
    payload: error,
  };
};

//delete training modules
export const deleteTrainingModules = (formData) => {
  return {
    type: DELETE_TRAINING_MODULE,
    payload: formData,
  };
};

export const deleteTrainingModulesSuccess = (response) => {
  return {
    type: DELETE_TRAINING_MODULE_SUCCESS,
    payload: response,
  };
};

export const deleteTrainingModulesFailure = (error) => {
  return {
    type: DELETE_TRAINING_MODULE_FAILURE,
    payload: error,
  };
};

//get training module by Id
export const getTrainingModuleById = (formData) => {
  return {
    type: GET_TRAINING_MODULE_BY_ID,
    payload: formData,
  };
};

export const getTrainingModuleByIdSuccess = (response) => {
  return {
    type: GET_TRAINING_MODULE_BY_ID_SUCCESS,
    payload: response,
  };
};

export const getTrainingModuleByIdFailure = (error) => {
  return {
    type: GET_TRAINING_MODULE_BY_ID_FAILURE,
    payload: error,
  };
};
