import {
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  GET_CONNECTED_USER,
  GET_CONNECTED_USER_SUCCESS,
  GET_CONNECTED_USER_FAILURE,
  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  CREATE_USER,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  ACTIVATE_USER,
  ACTIVATE_USER_SUCCESS,
  ACTIVATE_USER_FAILURE,
  INACTIVATE_USER,
  INACTIVATE_USER_SUCCESS,
  INACTIVATE_USER_FAILURE,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  VALIDATE_RETAILER,
  VALIDATE_RETAILER_SUCCESS,
  VALIDATE_RETAILER_FAILURE,
  GET_USERS_ROLE_WISE,
  GET_USERS_ROLE_WISE_SUCCESS,
  GET_USERS_ROLE_WISE_FAILURE,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
} from "./actionTypes";

const initialState = {
  data: null,
  userData: null,
  updateData: null,
  changePasswordSuccess: null,
  resetPasswordSuccess: null,
};

const Users = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_USERS_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_USERS_FAILURE:
      state = { ...state, data: null };
      break;
    case CHANGE_PASSWORD:
      state = {
        ...state,
        changePasswordSuccess: null,
      };
      break;
    case CHANGE_PASSWORD_SUCCESS:
      state = {
        ...state,
        changePasswordSuccess: action.payload,
      };
      break;
    case CHANGE_PASSWORD_FAILURE:
      state = { ...state, changePasswordSuccess: null };
      break;
    case GET_CONNECTED_USER:
      state = {
        ...state,
        userData: null,
      };
      break;
    case GET_CONNECTED_USER_SUCCESS:
      state = {
        ...state,
        userData: action.payload,
      };
      break;
    case GET_CONNECTED_USER_FAILURE:
      state = { ...state, userData: null };
      break;
    //Delete User case
    case DELETE_USER:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case DELETE_USER_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case DELETE_USER_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    // create case
    case CREATE_USER:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case CREATE_USER_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case CREATE_USER_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    // update case
    case UPDATE_USER:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case UPDATE_USER_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case UPDATE_USER_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    // Active user case
    case ACTIVATE_USER:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case ACTIVATE_USER_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case ACTIVATE_USER_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    // inActive user case
    case INACTIVATE_USER:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case INACTIVATE_USER_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case INACTIVATE_USER_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case FORGOT_PASSWORD:
      state = {
        ...state,
        forgotPasswordSuccess: null,
      };
      break;
    case FORGOT_PASSWORD_SUCCESS:
      state = {
        ...state,
        forgotPasswordSuccess: action.payload,
      };
      break;
    case FORGOT_PASSWORD_FAILURE:
      state = {
        ...state,
        forgotPasswordSuccess: null,
      };
      break;
    //Reset Password
    case RESET_PASSWORD:
      state = {
        ...state,
        resetPasswordSuccess: null,
      };
      break;
    case RESET_PASSWORD_SUCCESS:
      state = {
        ...state,
        resetPasswordSuccess: action.payload,
      };
      break;
    case RESET_PASSWORD_FAILURE:
      state = {
        ...state,
        resetPasswordSuccess: null,
      };
      break;
    // validate Retailer case
    case VALIDATE_RETAILER:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case VALIDATE_RETAILER_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case VALIDATE_RETAILER_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    // get role wise users
    case GET_USERS_ROLE_WISE:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_USERS_ROLE_WISE_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_USERS_ROLE_WISE_FAILURE:
      state = {
        ...state,
        data: null,
      };
      break;
    default:
      state = {
        ...state,
        changePasswordSuccess: null,
        updateData: null,
        userData: null,
      };
      break;
  }
  return state;
};

export default Users;
