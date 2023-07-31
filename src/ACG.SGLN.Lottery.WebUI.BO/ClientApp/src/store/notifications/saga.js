import { NOTIFICATION_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { checkHttpStatus } from "../../actions/apiUtils";
import { validateRequest } from "../../helpers";
import { GlobalNotificationHandle } from "../../services/NotificationHandler";
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import {
  GET_NOTIFICATION,
  ADD_NOTIFICATION,
  GET_NOTIFICATION_BY_ID,
} from "./actionTypes";
import {
  getNotificationSuccess,
  getNotificationFailure,
  addNotificationSuccess,
  addNotificationFailure,
  getNotificationByIdSuccess,
  getNotificationByIdFailure,
} from "./actions";

//get notification api call
function* getNotification(data) {
  const {
    page,
    size,
    type,
    title,
    body,
    targetRetailerId,
    minCreationDate,
    maxCreationDate,
  } = data.payload;
  try {
    const apiResponse = baseMethod(
      NOTIFICATION_CLIENT.get(
        page,
        size,
        type,
        title,
        body,
        targetRetailerId,
        minCreationDate,
        maxCreationDate
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
      yield put(getNotificationSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getNotificationFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getNotificationFailure(errorData));
  }
}

//for create notification
function* addNotification(formData) {
  const data = {
    title: formData.payload.title,
    body: formData.payload.body,
    type: formData.payload.type,
    targetRetailerIds: formData.payload.targetRetailerIds || undefined,
  };
  try {
    validateRequest(formData.payload.requiredKeys, formData.payload);
    const apiResponse = baseMethod(
      NOTIFICATION_CLIENT.create(data),
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
      yield put(addNotificationSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(addNotificationFailure(responseData));
    }
  } catch (error) {
    GlobalNotificationHandle(500, error.message);
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(addNotificationFailure(errorData));
  }
}

//for get notification by id
function* getNotificationById(formData) {
  try {
    const apiResponse = baseMethod(
      NOTIFICATION_CLIENT.getById(formData.payload),
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
      yield put(getNotificationByIdSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getNotificationByIdFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getNotificationByIdFailure(errorData));
  }
}

export function* watchGetNotificationSaga() {
  yield takeEvery(GET_NOTIFICATION, getNotification);
}
export function* watchAddNotificationSaga() {
  yield takeEvery(ADD_NOTIFICATION, addNotification);
}
export function* watchGetNotificationByIdSaga() {
  yield takeEvery(GET_NOTIFICATION_BY_ID, getNotificationById);
}

function* announcementSaga() {
  yield all([
    fork(watchGetNotificationSaga),
    fork(watchAddNotificationSaga),
    fork(watchGetNotificationByIdSaga),
  ]);
}

export default announcementSaga;
