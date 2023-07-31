import { REQUETS_COMMENT_CLIENT, REQUESTS_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { checkHttpStatus } from "../../actions/apiUtils";
import { GlobalNotificationHandle } from "../../services/NotificationHandler";
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import {
  GET_REQUESTS_COMMENT,
  GET_REQUESTS_COMMENT_BY_ID,
  CREATE_REQUESTS_COMMENT,
  DELETE_REQUESTS_COMMENT
} from "./actionTypes";
import {
  getRequestCommentSuccess,
  getRequestCommentsFailure,
  getRequestCommentByIdSuccess,
  getRequestCommentByIdFailure,
  createRequestCommentSuccess,
  createRequestCommentFailure,
  deleteRequestCommentSuccess,
  deleteRequestCommentFailure,
} from "./actions";
import {TRANSLATE} from "../../constants";

function* getRequestComment(data) {
  try {
    const {page, size, body, requestId} = data.payload;
    const apiResponse = baseMethod(REQUETS_COMMENT_CLIENT.get(page, size, body, requestId), "", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getRequestCommentSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getRequestCommentsFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRequestCommentsFailure(errorData));
  }
}
//getById
function* getRequestCommentById(data) {
  try {
    const apiResponse = baseMethod(
      REQUESTS_CLIENT.getCommentsById(data.payload),
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
      yield put(getRequestCommentByIdSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getRequestCommentByIdFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRequestCommentByIdFailure(errorData));
  }
}
//start
function* createRequestComment(formData) {
  const { data } = formData.payload;
  try {
    const apiResponse = baseMethod(REQUETS_COMMENT_CLIENT.create(data), TRANSLATE.t("SUCCESS_ALERT_MESG"), "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(createRequestCommentSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(createRequestCommentFailure(responseData));
    }
  } catch (error) {
    GlobalNotificationHandle(500, error.message);
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(createRequestCommentFailure(errorData));
  }
}

//close
function* deleteRequestComment(formData) {
  const { id } = formData.payload;
  try {
    const apiResponse = baseMethod(REQUETS_COMMENT_CLIENT.delete(id), TRANSLATE.t("SUCCESS_ALERT_MESG"), "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(deleteRequestCommentSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(deleteRequestCommentFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(deleteRequestCommentFailure(errorData));
  }
}

export function* watchGetRequestComments() {
  yield takeEvery(GET_REQUESTS_COMMENT, getRequestComment);
}
export function* watchGetRequestCommentById() {
  yield takeEvery(GET_REQUESTS_COMMENT_BY_ID, getRequestCommentById);
}
export function* watchCreateRequestComment() {
  yield takeEvery(CREATE_REQUESTS_COMMENT, createRequestComment);
}
export function* watchDeleteRequestComment() {
  yield takeEvery(DELETE_REQUESTS_COMMENT, deleteRequestComment);
}

function* requestCommentsSaga() {
  yield all([fork(watchGetRequestComments)]);
  yield all([fork(watchGetRequestCommentById)]);
  yield all([fork(watchCreateRequestComment)]);
  yield all([fork(watchDeleteRequestComment)]);
}

export default requestCommentsSaga;
