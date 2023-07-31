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

export const getUsers = (payload) => {
  return {
    type: GET_USERS,
    payload: payload,
  };
};

export const getUsersSuccess = (response) => {
  return {
    type: GET_USERS_SUCCESS,
    payload: response,
  };
};

export const getUsersFailure = (error) => {
  return {
    type: GET_USERS_FAILURE,
    payload: error,
  };
};

export const changePassword = (formData) => {
  return {
    type: CHANGE_PASSWORD,
    payload: formData,
  };
};

export const changePasswordSuccess = (response) => {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    payload: response,
  };
};

export const changePasswordFailure = (error) => {
  return {
    type: CHANGE_PASSWORD_FAILURE,
    payload: error,
  };
};

export const getConnectedUser = () => {
  return {
    type: GET_CONNECTED_USER,
    payload: null,
  };
};

export const getConnectedUserSuccess = (response) => {
  return {
    type: GET_CONNECTED_USER_SUCCESS,
    payload: response,
  };
};

export const getConnectedUserFailure = (error) => {
  return {
    type: GET_CONNECTED_USER_FAILURE,
    payload: error,
  };
};

export const deleteUser = (formData) => {
  return {
    type: DELETE_USER,
    payload: formData,
  };
};

export const deleteUserSuccess = (response) => {
  return {
    type: DELETE_USER_SUCCESS,
    payload: response,
  };
};

export const deleteUserFailure = (error) => {
  return {
    type: DELETE_USER_FAILURE,
    payload: error,
  };
};

export const createUser = (formData) => {
  return {
    type: CREATE_USER,
    payload: formData,
  };
};

export const createUserSuccess = (response) => {
  return {
    type: CREATE_USER_SUCCESS,
    payload: response,
  };
};

export const createUserFailure = (error) => {
  return {
    type: CREATE_USER_FAILURE,
    payload: error,
  };
};

export const updateUser = (formData) => {
  return {
    type: UPDATE_USER,
    payload: formData,
  };
};

export const updateUserSuccess = (response) => {
  return {
    type: UPDATE_USER_SUCCESS,
    payload: response,
  };
};

export const updateUserFailure = (error) => {
  return {
    type: UPDATE_USER_FAILURE,
    payload: error,
  };
};

export const activateUser = (formData) => {
  return {
    type: ACTIVATE_USER,
    payload: formData,
  };
};

export const activateUserSuccess = (response) => {
  return {
    type: ACTIVATE_USER_SUCCESS,
    payload: response,
  };
};

export const activateUserFailure = (error) => {
  return {
    type: ACTIVATE_USER_FAILURE,
    payload: error,
  };
};

export const inactivateUser = (formData) => {
  return {
    type: INACTIVATE_USER,
    payload: formData,
  };
};

export const inactivateUserSuccess = (response) => {
  return {
    type: INACTIVATE_USER_SUCCESS,
    payload: response,
  };
};

export const inactivateUserFailure = (error) => {
  return {
    type: INACTIVATE_USER_FAILURE,
    payload: error,
  };
};

export const forgotPassword = (email) => {
  return {
    type: FORGOT_PASSWORD,
    email: email,
  };
};

export const forgotPasswordSuccess = (response) => {
  return {
    type: FORGOT_PASSWORD_SUCCESS,
    payload: response,
  };
};

export const forgotPasswordFailure = (error) => {
  return {
    type: FORGOT_PASSWORD_FAILURE,
    payload: error,
  };
};

//reset Password action
export const resetPassword = (payload) => {
  return {
    type: RESET_PASSWORD,
    payload: payload,
  };
};

export const resetPasswordSuccess = (response) => {
  return {
    type: RESET_PASSWORD_SUCCESS,
    payload: response,
  };
};

export const resetPasswordFailure = (error) => {
  return {
    type: RESET_PASSWORD_FAILURE,
    payload: error,
  };
};

// validate retailer
export const validateRetailer = (id) => {
  return {
    type: VALIDATE_RETAILER,
    payload: id,
  };
};

export const validateRetailerSuccess = (response) => {
  return {
    type: VALIDATE_RETAILER_SUCCESS,
    payload: response,
  };
};

export const validateRetailerFailure = (error) => {
  return {
    type: VALIDATE_RETAILER_FAILURE,
    payload: error,
  };
};

// role Wise User
export const getRoleWiseUsers = (roleName) => {
  return {
    type: GET_USERS_ROLE_WISE,
    payload: roleName,
  };
};

export const getRoleWiseUsersSuccess = (response) => {
  return {
    type: GET_USERS_ROLE_WISE_SUCCESS,
    payload: response,
  };
};

export const getRoleWiseUsersFailure = (error) => {
  return {
    type: GET_USERS_ROLE_WISE_FAILURE,
    payload: error,
  };
};
