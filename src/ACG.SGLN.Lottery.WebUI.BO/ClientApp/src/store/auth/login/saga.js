import { AUTH_CLIENT } from "../../../actions/config";
import axios from "axios";
import { takeEvery, fork, put, all, call } from 'redux-saga/effects';
import { checkHttpStatus } from "../../../actions/apiUtils";
// Login Redux States
import { baseMethod } from "../../../services/BaseService";
import { LOGIN_USER, LOGOUT_USER } from './actionTypes';
import { UsersClient } from "../../../ACG.SGLN.Lottery-api";
import { loginSuccess, loginFailure, logoutUserSuccess, logoutUserFailure } from './actions';

// creating global instance for the axios to call apis
export const AXIOS_INSTANCE = axios.create({
  headers: { "Access-Control-Allow-Origin": "*" },
});
// base url
export const BASE_URL = `${process.env.REACT_APP_API_URL}`;

function* loginUser(formData) {
    try {
        const apiResponse = baseMethod(AUTH_CLIENT.signIn(formData.payload), "", "", "");
        const response = yield call(checkHttpStatus, apiResponse);
        if (response.succeeded) {
          AXIOS_INSTANCE.defaults.headers.common["Authorization"] = `Bearer ${response.accessToken}`;
          const USERS_CLIENT = new UsersClient(BASE_URL, AXIOS_INSTANCE);
          const userResponse = baseMethod(USERS_CLIENT.getConnectedUser(), "", "", "");
          const userData = yield call(checkHttpStatus, userResponse);
          if (userData){
            const responseData = {
              data: response,
              userData: userData
            };
            localStorage.setItem("loginInfo", JSON.stringify(responseData));
            yield put(loginSuccess(responseData));
          }
        } else {
          const responseData = {
            data: response,
          };
          yield put(loginFailure(responseData));
        }
    } catch (error) {
        const errorData = {
            error: {
              statusText: error,
              netWorkError: true,
            },
          };
          yield put(loginFailure(errorData));
    }
}


function* logoutUser() {
  try {
      const apiResponse = baseMethod(AUTH_CLIENT.logOut(null), "", "", "");
          const responseData = {
            data: apiResponse
          };
          localStorage.removeItem('loginInfo');
          yield put(logoutUserSuccess(responseData));
  } catch (error) {
      const errorData = {
          error: {
            statusText: error,
            netWorkError: true,
          },
        };
        yield put(logoutUserFailure(errorData));
  }
}

export function* watchUserLogin() {
    yield takeEvery(LOGIN_USER, loginUser)
}

export function* watchUserLogout() {
  yield takeEvery(LOGOUT_USER, logoutUser)
}

function* authSaga() {
    yield all([
        fork(watchUserLogin),
        fork(watchUserLogout),
    ]);
}

export default authSaga;