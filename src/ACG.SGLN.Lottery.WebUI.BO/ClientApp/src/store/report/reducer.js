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

const initialState = {
  data: null,
};

const report = (state = initialState, action) => {
  switch (action.type) {
    // Generate Trainings By Module report
    case GET_TRAINING_REPORT_BY_MODULE:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_TRAINING_REPORT_BY_MODULE_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_TRAINING_REPORT_BY_MODULE_FAILURE:
      state = { ...state, data: null };
      break;
    // Generate Trainings By Retailer report
    case GET_TRAINING_REPORT_BY_RETAILER:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_TRAINING_REPORT_BY_RETAILER_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_TRAINING_REPORT_BY_RETAILER_FAILURE:
      state = {
        ...state,
        data: null,
      };
      break;
    // Generate report by incentive
    case GET_TRAINING_REPORT_BY_INCENTIVE:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_TRAINING_REPORT_BY_INCENTIVE_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_TRAINING_REPORT_BY_INCENTIVE_FAILURE:
      state = {
        ...state,
        data: null,
      };
      break;

      // Generate request report
    case GET_REQUESTS_REPORT:
      state = {
        ...state,
        requestReportData: null,
      };
      break;
    case GET_REQUESTS_REPORT_SUCCESS:
      state = {
        ...state,
        requestReportData: action.payload,
      };
      break;
    case GET_REQUESTS_REPORT_FAILURE:
      state = { ...state, requestReportData: null };
      break;

    // Generate Ratio Requests Reports
    case GET_RATIO_REPORT:
      state = {
        ...state,
        ratioReportData: null,
      };
      break;
    case GET_RATIO_REPORT_SUCCESS:
      state = {
        ...state,
        ratioReportData: action.payload,
      };
      break;
    case GET_RATIO_REPORT_FAILURE:
      state = {
        ...state,
        ratioReportData: null,
      };
      break;

    // Generate time requests reports
    case GET_TIME_RQUESTS_REPORT:
      state = {
        ...state,
        timeReportdata: null,
      };
      break;
    case GET_TIME_RQUESTS_REPORT_SUCCESS:
      state = {
        ...state,
        timeReportdata: action.payload,
      };
      break;
    case GET_TIME_RQUESTS_REPORT_FAILURE:
      state = {
        ...state,
        timeReportdata: null,
      };
      break;

    // Get retailer reports
    case GET_RETAILER_REPORT:
      state = {
        ...state,
        retailerReportData: null,
      };
      break;
    case GET_RETAILER_REPORT_SUCCESS:
      state = {
        ...state,
        retailerReportData: action.payload ? action.payload.data : null,
      };
      break;
    case GET_RETAILER_REPORT_FAILURE:
      state = {
        ...state,
        retailerReportData: null,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default report;
