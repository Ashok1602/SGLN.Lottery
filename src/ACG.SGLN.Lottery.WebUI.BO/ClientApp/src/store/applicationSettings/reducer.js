import {
  GET_APPLICATION_SETTING,
  GET_APPLICATION_SETTING_SUCCESS,
  GET_APPLICATION_SETTING_FAILURE,
  ADD_APPLICATION_SETTING,
  ADD_APPLICATION_SETTING_SUCCESS,
  ADD_APPLICATION_SETTING_FAILURE,
  UPDATE_APPLICATION_SETTING,
  UPDATE_APPLICATION_SETTING_SUCCESS,
  UPDATE_APPLICATION_SETTING_FAILURE,
  DELETE_APPLICATION_SETTING,
  DELETE_APPLICATION_SETTING_SUCCESS,
  DELETE_APPLICATION_SETTING_FAILURE,
  ACTIVATE_APPLICATION_SETTING,
  ACTIVATE_APPLICATION_SETTING_SUCCESS,
  ACTIVATE_APPLICATION_SETTING_FAILURE,
  INACTIVATE_APPLICATION_SETTING,
  INACTIVATE_APPLICATION_SETTING_SUCCESS,
  INACTIVATE_APPLICATION_SETTING_FAILURE,
} from "./actionTypes";

const initialState = {
  data: null,
  createData: null,
  updateData: null,
};

const applicationSettings = (state = initialState, action) => {
  switch (action.type) {
    case GET_APPLICATION_SETTING:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_APPLICATION_SETTING_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_APPLICATION_SETTING_FAILURE:
      state = { ...state, data: null };
      break;
    //create APPLICATION_SETTING case
    case ADD_APPLICATION_SETTING:
      state = {
        ...state,
        createData: null,
      };
      break;
    case ADD_APPLICATION_SETTING_SUCCESS:
      state = {
        ...state,
        createData: action.payload,
      };
      break;
    case ADD_APPLICATION_SETTING_FAILURE:
      state = {
        ...state,
        createData: null,
      };
      break;
    // update case
    case UPDATE_APPLICATION_SETTING:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case UPDATE_APPLICATION_SETTING_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case UPDATE_APPLICATION_SETTING_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    //Delete APPLICATION_SETTING case
    case DELETE_APPLICATION_SETTING:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case DELETE_APPLICATION_SETTING_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case DELETE_APPLICATION_SETTING_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    //Activate APPLICATION_SETTING case
    case ACTIVATE_APPLICATION_SETTING:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case ACTIVATE_APPLICATION_SETTING_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case ACTIVATE_APPLICATION_SETTING_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    //inActivate APPLICATION_SETTING case
    case INACTIVATE_APPLICATION_SETTING:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case INACTIVATE_APPLICATION_SETTING_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case INACTIVATE_APPLICATION_SETTING_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    default:
      state = { ...state, createData: null, updateData: null };
      break;
  }
  return state;
};

export default applicationSettings;
