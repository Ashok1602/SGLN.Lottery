import {
  GET_TRAINING_REPORT_BY_MODULE,
  GET_TRAINING_REPORT_BY_MODULE_SUCCESS,
  GET_TRAINING_REPORT_BY_MODULE_FAILURE,
  GET_TRAINING_REPORT_BY_RETAILER,
  GET_TRAINING_REPORT_BY_RETAILER_SUCCESS,
  GET_TRAINING_REPORT_BY_RETAILER_FAILURE,
  GET_TRAINING_REPORT_BY_INCENTIVE,
  GET_TRAINING_REPORT_BY_INCENTIVE_SUCCESS,
  GET_TRAINING_REPORT_BY_INCENTIVE_FAILURE,
  GET_RATIO_REPORT,
  GET_RATIO_REPORT_SUCCESS,
  GET_RATIO_REPORT_FAILURE,
  GET_REQUESTS_REPORT,
  GET_REQUESTS_REPORT_SUCCESS,
  GET_REQUESTS_REPORT_FAILURE,
  GET_TIME_RQUESTS_REPORT,
  GET_TIME_RQUESTS_REPORT_SUCCESS,
  GET_TIME_RQUESTS_REPORT_FAILURE,
  GET_RETAILER_REPORT,
  GET_RETAILER_REPORT_SUCCESS,
  GET_RETAILER_REPORT_FAILURE
} from "./actionTypes";

// Generate Trainings By Module report
export const trainingReportByModule = (payload) => {
  return {
    type: GET_TRAINING_REPORT_BY_MODULE,
    payload: payload,
  };
};

export const trainingReportByModuleSuccess = (response) => {
  return {
    type: GET_TRAINING_REPORT_BY_MODULE_SUCCESS,
    payload: response,
  };
};

export const trainingReportByModuleFailure = (error) => {
  return {
    type: GET_TRAINING_REPORT_BY_MODULE_FAILURE,
    payload: error,
  };
};

// Generate Trainings By Retailer report
export const trainingReportByRetailer = (payload) => {
  return {
    type: GET_TRAINING_REPORT_BY_RETAILER,
    payload: payload,
  };
};

export const trainingReportByRetailerSuccess = (response) => {
  return {
    type: GET_TRAINING_REPORT_BY_RETAILER_SUCCESS,
    payload: response,
  };
};

export const trainingReportByRetailerFailure = (error) => {
  return {
    type: GET_TRAINING_REPORT_BY_RETAILER_FAILURE,
    payload: error,
  };
};

// Generate report by incentive
export const reportByIncentive = (payload) => {
  return {
    type: GET_TRAINING_REPORT_BY_INCENTIVE,
    payload: payload,
  };
};

export const reportByIncentiveSuccess = (response) => {
  return {
    type: GET_TRAINING_REPORT_BY_INCENTIVE_SUCCESS,
    payload: response,
  };
};

export const reportByIncentiveFailure = (error) => {
  return {
    type: GET_TRAINING_REPORT_BY_INCENTIVE_FAILURE,
    payload: error,
  };
};

// Generate Ratio report
export const generateRatioReports = (payload) => {
  return {
    type: GET_RATIO_REPORT,
    payload: payload,
  };
};

export const generateRatioReportsSuccess = (response) => {
  return {
    type: GET_RATIO_REPORT_SUCCESS,
    payload: response,
  };
};

export const generateRatioReportsFailure = (error) => {
  return {
    type: GET_RATIO_REPORT_FAILURE,
    payload: error,
  };
};

// Generate Requests report
export const generateRequestReport = (payload) => {
  return {
    type: GET_REQUESTS_REPORT,
    payload: payload,
  };
};

export const generateRequestReportSuccess = (response) => {
  return {
    type: GET_REQUESTS_REPORT_SUCCESS,
    payload: response,
  };
};

export const generateRequestReportFailure = (error) => {
  return {
    type: GET_REQUESTS_REPORT_FAILURE,
    payload: error,
  };
};

// Generate time procesing request reports
export const generateTimeRequestReport = (payload) => {
  return {
    type: GET_TIME_RQUESTS_REPORT,
    payload: payload,
  };
};

export const generateTimeRequestReportSuccess = (response) => {
  return {
    type: GET_TIME_RQUESTS_REPORT_SUCCESS,
    payload: response,
  };
};

export const generateTimeRequestReportFailure = (error) => {
  return {
    type: GET_TIME_RQUESTS_REPORT_FAILURE,
    payload: error,
  };
};

// get retailer report
export const getRetailerReport = (payload) => {
  return {
    type: GET_RETAILER_REPORT,
    payload: payload,
  };
};

export const getRetailerReportSuccess = (response) => {
  return {
    type: GET_RETAILER_REPORT_SUCCESS,
    payload: response,
  };
};

export const getRetailerReportFailure = (error) => {
  return {
    type: GET_RETAILER_REPORT_FAILURE,
    payload: error,
  };
};