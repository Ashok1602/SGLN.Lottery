import { USERS_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { checkHttpStatus } from "../../actions/apiUtils";
import { validateRequest } from "../../helpers"
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import {
  GET_USERS,
  CHANGE_PASSWORD,
  GET_CONNECTED_USER,
  DELETE_USER,
  CREATE_USER,
  UPDATE_USER,
  ACTIVATE_USER,
  INACTIVATE_USER,
  FORGOT_PASSWORD,
  VALIDATE_RETAILER,
  GET_USERS_ROLE_WISE,
  RESET_PASSWORD
} from "./actionTypes";
import {
  getUsersSuccess,
  getUsersFailure,
  changePasswordSuccess,
  changePasswordFailure,
  getConnectedUserSuccess,
  getConnectedUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
  createUserSuccess,
  createUserFailure,
  updateUserSuccess,
  updateUserFailure,
  activateUserSuccess,
  activateUserFailure,
  inactivateUserSuccess,
  inactivateUserFailure,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  validateRetailerSuccess,
  validateRetailerFailure,
  getRoleWiseUsersSuccess,
  getRoleWiseUsersFailure,
  resetPasswordSuccess,
  resetPasswordFailure,
} from "./actions";
import { TRANSLATE } from "../../constants";

function* getUsers(data) {
  try {
    const { page, size, userName, email, firstName, lastName, roleId, isDeactivated, roles } = data.payload;
    const apiResponse = baseMethod(
      USERS_CLIENT.get(page, size, userName, email, firstName, lastName, roleId, isDeactivated, roles), "", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getUsersSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getUsersFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getUsersFailure(errorData));
  }
}
//for change password
function* changePassword(formData) {
  try {
    const apiResponse = baseMethod(
      USERS_CLIENT.changePassword(formData.payload), "Mot de passe modifié avec succès", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(changePasswordSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(changePasswordFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(changePasswordFailure(errorData));
  }
}

//get connected user
function* getConnectedUser() {
  try {
    const apiResponse = baseMethod(USERS_CLIENT.getConnectedUser(), "", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getConnectedUserSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getConnectedUserFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getConnectedUserFailure(errorData));
  }
}

//delete user
function* deleteUser(formData) {
  try {
    const { id } = formData.payload;
    const apiResponse = baseMethod(USERS_CLIENT.deleteUser(id), "", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(deleteUserSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(deleteUserFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(deleteUserFailure(errorData));
  }
}

//create user
function* createUser(formData) {
  try {
    validateRequest(formData.payload.requiredKeys, formData.payload);
    const { Email, firstName, userName = "", lastName, phoneNumber, roleName, administration } = formData.payload;
    const apiResponse = baseMethod(USERS_CLIENT.createUser({Email, firstName, userName, lastName, phoneNumber, roleName, administration}),  TRANSLATE.t("USERS.USER_CREATED_SUCCESS"), "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(createUserSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(createUserFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(createUserFailure(errorData));
  }
}

//Update user
function* updateUser(formData) {
  try {
    let recordId = formData.payload.id;
    let bodyData = { ...formData.payload };
    delete bodyData.id;
    const apiResponse = baseMethod(
      USERS_CLIENT.updateUser(recordId, bodyData),
      "",
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(updateUserSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(updateUserFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(updateUserFailure(errorData));
  }
}

//Activate user
function* activateUser(formData) {
  try {
    const apiResponse = baseMethod(
      USERS_CLIENT.activate(formData.payload.id),
      TRANSLATE.t("SUCCESS_ALERT_MESG"),
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(activateUserSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(activateUserFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(activateUserFailure(errorData));
  }
}

//In Activate user
function* inActivateUser(formData) {
  try {
    const apiResponse = baseMethod(
      USERS_CLIENT.deactivate(formData.payload.id),
      TRANSLATE.t("SUCCESS_ALERT_MESG"),
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(inactivateUserSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(inactivateUserFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(inactivateUserFailure(errorData));
  }
}

//forgot password
function* forgotPassword(formData) {
  try {
    const apiResponse = baseMethod(
      USERS_CLIENT.forgotPassword(formData.email),
      TRANSLATE.t("FORGOT_PASSWORD_SUCCESS_MSG"),
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(forgotPasswordSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(forgotPasswordFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(forgotPasswordFailure(errorData));
  }
}

//Reset password
function* resetPassword(formData) {
  const data = {
    email: formData.payload.email,
    newPassword: formData.payload.newPassword,
    code: formData.payload.code
  }
  try {
    const apiResponse = baseMethod(
      USERS_CLIENT.resetPassword(data),
      TRANSLATE.t("RESET_PASSWORD.SUCCESS_MSG"),
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(resetPasswordSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(resetPasswordFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(resetPasswordFailure(errorData));
  }
}

//validate Retailer
function* validateRetailer(formData) {
  try {
    const apiResponse = baseMethod(
      USERS_CLIENT.validateRetailer(formData.payload.id),
      "",
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(validateRetailerSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(validateRetailerFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(validateRetailerFailure(errorData));
  }
}

//get role wise users
function* getRoleWiseUsers(formData) {
  try {
    const apiResponse = baseMethod(
      USERS_CLIENT.getByRoles(formData.payload),
      "",
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getRoleWiseUsersSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getRoleWiseUsersFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRoleWiseUsersFailure(errorData));
  }
}


export function* watchGetUsers() {
  yield takeEvery(GET_USERS, getUsers);
}

export function* watchChangePassword() {
  yield takeEvery(CHANGE_PASSWORD, changePassword);
}

export function* watchGetConnectedUser() {
  yield takeEvery(GET_CONNECTED_USER, getConnectedUser);
}

export function* watchDeleteUser() {
  yield takeEvery(DELETE_USER, deleteUser);
}

export function* watchCreateUser() {
  yield takeEvery(CREATE_USER, createUser);
}

export function* watchUpdateUser() {
  yield takeEvery(UPDATE_USER, updateUser);
}

export function* watchActiveUser() {
  yield takeEvery(ACTIVATE_USER, activateUser);
}

export function* watchInativeUser() {
  yield takeEvery(INACTIVATE_USER, inActivateUser);
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

export function* watchResetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

export function* watchValidateRetailer() {
  yield takeEvery(VALIDATE_RETAILER, validateRetailer);
}
export function* watchGetRoleWiseUsers() {
  yield takeEvery(GET_USERS_ROLE_WISE, getRoleWiseUsers);
}
function* usersSaga() {
  yield all([fork(watchGetUsers)]);
  yield all([fork(watchChangePassword)]);
  yield all([fork(watchGetConnectedUser)]);
  yield all([fork(watchDeleteUser)]);
  yield all([fork(watchCreateUser)]);
  yield all([fork(watchUpdateUser)]);
  yield all([fork(watchActiveUser)]);
  yield all([fork(watchInativeUser)]);
  yield all([fork(watchForgotPassword)]);
  yield all([fork(watchResetPassword)]);
  yield all([fork(watchValidateRetailer)]);
  yield all([fork(watchGetRoleWiseUsers)]);
}
export default usersSaga;
