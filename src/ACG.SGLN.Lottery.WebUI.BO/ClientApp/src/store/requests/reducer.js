import {
  GET_REQUESTS,
  GET_REQUESTS_SUCCESS,
  GET_REQUESTS_FAILURE,
  GET_REQUESTS_BY_ID,
  GET_REQUESTS_BY_ID_SUCCESS,
  GET_REQUESTS_BY_ID_FAILURE,
  START_REQUESTS,
  START_REQUESTS_SUCCESS,
  START_REQUESTS_FAILURE,
  CLOSE_REQUESTS,
  CLOSE_REQUESTS_SUCCESS,
  CLOSE_REQUESTS_FAILURE,
  ASSIGN_REQUESTS,
  ASSIGN_REQUESTS_SUCCESS,
  ASSIGN_REQUESTS_FAILURE,
} from "./actionTypes";

const initialState = {
  data: null,
  userData: null,
  changePasswordSuccess: null,
  assignData: null,
};

const Requests = (state = initialState, action) => {
  switch (action.type) {
    case GET_REQUESTS:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_REQUESTS_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_REQUESTS_FAILURE:
      state = { ...state, data: null };
      break;
    //getById
    case GET_REQUESTS_BY_ID:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_REQUESTS_BY_ID_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_REQUESTS_BY_ID_FAILURE:
      state = { ...state, data: null };
      break;
    //start
    case START_REQUESTS:
      state = {
        ...state,
        startData: null,
      };
      break;
    case START_REQUESTS_SUCCESS:
      state = {
        ...state,
        startData: action.payload,
      };
      break;
    case START_REQUESTS_FAILURE:
      state = { ...state, startData: null };
      break;
    //close
    case CLOSE_REQUESTS:
      state = {
        ...state,
        closeData: null,
      };
      break;
    case CLOSE_REQUESTS_SUCCESS:
      state = {
        ...state,
        closeData: action.payload,
      };
      break;
    case CLOSE_REQUESTS_FAILURE:
      state = { ...state, closeData: null };
      break;
    //close
    case ASSIGN_REQUESTS:
      state = {
        ...state,
        assignData: null,
      };
      break;
    case ASSIGN_REQUESTS_SUCCESS:
      state = {
        ...state,
        assignData: action.payload,
      };
      break;
    case ASSIGN_REQUESTS_FAILURE:
      state = { ...state, assignData: null };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default Requests;
