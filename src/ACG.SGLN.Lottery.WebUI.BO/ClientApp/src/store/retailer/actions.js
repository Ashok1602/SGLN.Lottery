import {
  GET_STRIPPED_RETAILER,
  GET_STRIPPED_RETAILER_SUCCESS,
  GET_STRIPPED_RETAILER_FAILURE,
  GET_RETAILER,
  GET_RETAILER_SUCCESS,
  GET_RETAILER_FAILURE,
  GET_RETAILER_BY_ID,
  GET_RETAILER_BY_ID_SUCCESS,
  GET_RETAILER_BY_ID_FAILURE,
  GET_RETAILER_AGENT,
  GET_RETAILER_AGENT_SUCCESS,
  GET_RETAILER_AGENT_FAILURE,
  ASSIGN_AGENT_TO_RETAILER,
  ASSIGN_AGENT_TO_RETAILER_SUCCESS,
  ASSIGN_AGENT_TO_RETAILER_FAILURE,
  GET_FROM_FILE,
  GET_FROM_FILE_SUCCESS,
  GET_FROM_FILE_FAILURE,
  ASSIGN_SALE_REPRESENTATIVE,
  ASSIGN_SALE_REPRESENTATIVE_SUCCESS,
  ASSIGN_SALE_REPRESENTATIVE_FAILURE,
  GET_MUNCIPALITIES,
  GET_MUNCIPALITIES_SUCCESS,
  GET_MUNCIPALITIES_FAILURE,
  MASS_ASSIGNMENT,
  MASS_ASSIGNMENT_SUCCESS,
  MASS_ASSIGNMENT_FAILURE
} from "./actionTypes";

//stripped Retailer Action
export const getStrippedRetailer = (filter) => {
  return {
    type: GET_STRIPPED_RETAILER,
    payload: filter,
  };
};

export const getStrippedRetailerSuccess = (response) => {
  return {
    type: GET_STRIPPED_RETAILER_SUCCESS,
    payload: response,
  };
};

export const getStrippedRetailerFailure = (error) => {
  return {
    type: GET_STRIPPED_RETAILER_FAILURE,
    payload: error,
  };
};

// Retailer list Action
export const getRetailer = (filter) => {
  return {
    type: GET_RETAILER,
    payload: filter,
  };
};

export const getRetailerSuccess = (response) => {
  return {
    type: GET_RETAILER_SUCCESS,
    payload: response,
  };
};

export const getRetailerFailure = (error) => {
  return {
    type: GET_RETAILER_FAILURE,
    payload: error,
  };
};

// Retailer By ID Action
export const getRetailerById = (id) => {
  return {
    type: GET_RETAILER_BY_ID,
    payload: id,
  };
};

export const getRetailerByIdSuccess = (response) => {
  return {
    type: GET_RETAILER_BY_ID_SUCCESS,
    payload: response,
  };
};

export const getRetailerByIdFailure = (error) => {
  return {
    type: GET_RETAILER_BY_ID_FAILURE,
    payload: error,
  };
};

// Retailer Agent By ID Action
export const getRetailerAgent = (id) => {
  return {
    type: GET_RETAILER_AGENT,
    payload: id,
  };
};

export const getRetailerAgentSuccess = (response) => {
  return {
    type: GET_RETAILER_AGENT_SUCCESS,
    payload: response,
  };
};

export const getRetailerAgentFailure = (error) => {
  return {
    type: GET_RETAILER_AGENT_FAILURE,
    payload: error,
  };
};

// Assign Agent to retailer Action
export const assignAgentToRetailer = (requestData) => {
  return {
    type: ASSIGN_AGENT_TO_RETAILER,
    payload: requestData,
  };
};

export const assignAgentToRetailerSuccess = (response) => {
  return {
    type: ASSIGN_AGENT_TO_RETAILER_SUCCESS,
    payload: response,
  };
};

export const assignAgentToRetailerFailure = (error) => {
  return {
    type: ASSIGN_AGENT_TO_RETAILER_FAILURE,
    payload: error,
  };
};


// get retailer fron file Action
export const getFromFile = (requestData) => {
  return {
    type: GET_FROM_FILE,
    payload: requestData,
  };
};

export const getFromFileSuccess = (response) => {
  return {
    type: GET_FROM_FILE_SUCCESS,
    payload: response,
  };
};

export const getFromFileFailure = (error) => {
  return {
    type: GET_FROM_FILE_FAILURE,
    payload: error,
  };
};

// Assign sale representative Action
export const assignSaleRepresentative = (requestData) => {
  return {
    type: ASSIGN_SALE_REPRESENTATIVE,
    payload: requestData,
  };
};

export const assignSaleRepresentativeSuccess = (response) => {
  return {
    type: ASSIGN_SALE_REPRESENTATIVE_SUCCESS,
    payload: response,
  };
};

export const assignSaleRepresentativeFailure = (error) => {
  return {
    type: ASSIGN_SALE_REPRESENTATIVE_FAILURE,
    payload: error,
  };
};

// get muncipalities
export const getMuncipalities = () => {
  return {
    type: GET_MUNCIPALITIES,
    payload: null
  };
};

export const getMuncipalitiesSuccess = (response) => {
  return {
    type: GET_MUNCIPALITIES_SUCCESS,
    payload: response,
  };
};

export const getMuncipalitiesFailure = (error) => {
  return {
    type: GET_MUNCIPALITIES_FAILURE,
    payload: error,
  };
};

// for mass assignment
export const massAssignment = (requestData) => {
  return {
    type: MASS_ASSIGNMENT,
    payload: requestData
  };
};

export const massAssignmentSuccess = (response) => {
  return {
    type: MASS_ASSIGNMENT_SUCCESS,
    payload: response,
  };
};

export const massAssignmentFailure = (error) => {
  return {
    type: MASS_ASSIGNMENT_FAILURE,
    payload: error,
  };
};