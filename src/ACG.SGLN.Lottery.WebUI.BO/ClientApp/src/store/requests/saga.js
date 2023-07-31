import { REQUESTS_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { checkHttpStatus } from "../../actions/apiUtils";
import { GlobalNotificationHandle } from "../../services/NotificationHandler";
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import {
  GET_REQUESTS,
  GET_REQUESTS_BY_ID,
  START_REQUESTS,
  CLOSE_REQUESTS,
  ASSIGN_REQUESTS,
} from "./actionTypes";
import {
  getRequestsSuccess,
  getRequestsFailure,
  getRequestByIdSuccess,
  getRequestByIdFailure,
  startRequestSuccess,
  startRequestFailure,
  closeRequestSuccess,
  closeRequestFailure,
  assignRequestSuccess,
  assignRequestFailure,
} from "./actions";
import { TRANSLATE } from "../../constants";

function* getRequests(data) {
  const {
    page,
    size,
    requestObject,
    requestCategory,
    requestNature,
    directionInCharge,
    lastStatus,
    startDate,
    endDate,
    retailer,
    requestAssignedTo,
    firstName,
    lastName,
    phone,
    isNotified,
  } = data.payload;
  try {
    const apiResponse = baseMethod(
      REQUESTS_CLIENT.get(
        page,
        size,
        requestObject,
        requestCategory,
        requestNature,
        directionInCharge,
        lastStatus,
        startDate,
        endDate,
        retailer,
        requestAssignedTo,
        firstName,
        lastName,
        phone,
        isNotified
      ),
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
      yield put(getRequestsSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getRequestsFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRequestsFailure(errorData));
  }
}
//getById
function* getRequestById(data) {
  try {
    const apiResponse = baseMethod(
      REQUESTS_CLIENT.getById(data.payload),
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
      yield put(getRequestByIdSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getRequestByIdFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRequestByIdFailure(errorData));
  }
}
//start
function* startRequest(data) {
  const { id } = data.payload;
  try {
    const apiResponse = baseMethod(
      REQUESTS_CLIENT.start(id),
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
      yield put(startRequestSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(startRequestFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(startRequestFailure(errorData));
  }
}

//close
function* closeRequest(formData) {
  const { id, data } = formData.payload;
  try {
    const apiResponse = baseMethod(
      REQUESTS_CLIENT.close(id, data),
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
      yield put(closeRequestSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(closeRequestFailure(responseData));
    }
  } catch (error) {
    GlobalNotificationHandle(500, error.message);
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(closeRequestFailure(errorData));
  }
}

//assign
function* assignRequest(formData) {
  const { id, isExternal, processingDirection } = formData.payload;
  try {
    const apiResponse = baseMethod(
      REQUESTS_CLIENT.assign(id, isExternal, processingDirection),
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
      yield put(assignRequestSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(assignRequestFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(assignRequestFailure(errorData));
  }
}

export function* watchGetRequests() {
  yield takeEvery(GET_REQUESTS, getRequests);
}
export function* watchGetRequestById() {
  yield takeEvery(GET_REQUESTS_BY_ID, getRequestById);
}
export function* watchCloseRequest() {
  yield takeEvery(CLOSE_REQUESTS, closeRequest);
}
export function* watchStartRequest() {
  yield takeEvery(START_REQUESTS, startRequest);
}
export function* watchAssignRequest() {
  yield takeEvery(ASSIGN_REQUESTS, assignRequest);
}

function* usersSaga() {
  yield all([fork(watchGetRequests)]);
  yield all([fork(watchGetRequestById)]);
  yield all([fork(watchStartRequest)]);
  yield all([fork(watchCloseRequest)]);
  yield all([fork(watchAssignRequest)]);
}

export default usersSaga;
