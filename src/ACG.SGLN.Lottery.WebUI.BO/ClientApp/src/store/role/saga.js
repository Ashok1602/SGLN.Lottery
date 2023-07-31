import { ROLE_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { checkHttpStatus } from "../../actions/apiUtils";
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import { GET_ROLE } from "./actionTypes";
import { getRoleSuccess, getRoleFailure } from "./actions";

//get role
function* getRole() {
  try {
    const apiResponse = baseMethod(ROLE_CLIENT.get(), "", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getRoleSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getRoleFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRoleFailure(errorData));
  }
}
export function* watchGetRoleSaga() {
    yield takeEvery(GET_ROLE, getRole);
  }

function* roleSaga() {
    yield all([
      fork(watchGetRoleSaga),
    ]);
  }
  
  export default roleSaga;