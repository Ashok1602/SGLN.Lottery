import { ANNOUNCEMENT_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { checkHttpStatus } from "../../actions/apiUtils";
import { validateRequest } from "../../helpers";
import { GlobalNotificationHandle } from "../../services/NotificationHandler";
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import {
  GET_ANNOUNCEMENT,
  ADD_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  PUBLISH_ANNOUNCEMENT,
  UNPUBLISH_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
} from "./actionTypes";
import {
  getAnnouncementSuccess,
  getAnnouncementFailure,
  addAnnouncementSuccess,
  addAnnouncementFailure,
  updateAnnouncementSuccess,
  updateAnnouncementFailure,
  deleteAnnouncementSuccess,
  deleteAnnouncementFailure,
  publishAnnouncementSuccess,
  publishAnnouncementFailure,
  unPublishAnnouncementSuccess,
  unPublishAnnouncementFailure,
} from "./actions";
//get announcements api call
function* getAnnouncement(data) {
  const { page, size, minCreationDate, maxCreationDate, title } = data.payload;
  try {
    const apiResponse = baseMethod(
      ANNOUNCEMENT_CLIENT.get(
        page,
        size,
        minCreationDate,
        maxCreationDate,
        title
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
      yield put(getAnnouncementSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getAnnouncementFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getAnnouncementFailure(errorData));
  }
}

//for create announcement
function* addAnnouncement(formData) {
  const { title, body, coverImage, requiredKeys } = formData.payload;
  try {
    validateRequest(requiredKeys, formData.payload);
    const apiResponse = baseMethod(
      ANNOUNCEMENT_CLIENT.create(title, body, coverImage),
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
      yield put(addAnnouncementSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(addAnnouncementFailure(responseData));
    }
  } catch (error) {
    GlobalNotificationHandle(500, error.message);
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(addAnnouncementFailure(errorData));
  }
}
//for update announcement
function* updateAnnouncement(formData) {
  try {
    const apiResponse = baseMethod(
      ANNOUNCEMENT_CLIENT.update(
        formData.payload.id,
        formData.payload.title,
        formData.payload.body,
        formData.payload.documets
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
      yield put(updateAnnouncementSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(updateAnnouncementFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(updateAnnouncementFailure(errorData));
  }
}
//for delete announcement
function* deleteAnnouncement(formData) {
  try {
    const apiResponse = baseMethod(
      ANNOUNCEMENT_CLIENT.delete(formData.payload.id),
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
      yield put(deleteAnnouncementSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(deleteAnnouncementFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(deleteAnnouncementFailure(errorData));
  }
}
//for publish announcement
function* publishAnnouncement(formData) {
  try {
    const apiResponse = baseMethod(
      ANNOUNCEMENT_CLIENT.publish(formData.payload.id),
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
      yield put(publishAnnouncementSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(publishAnnouncementFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(publishAnnouncementFailure(errorData));
  }
}
//for un-publish announcement
function* unPublishAnnouncement(formData) {
  try {
    const apiResponse = baseMethod(
      ANNOUNCEMENT_CLIENT.unpublish(formData.payload.id),
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
      yield put(unPublishAnnouncementSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(unPublishAnnouncementFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(unPublishAnnouncementFailure(errorData));
  }
}

export function* watchGetAnnouncementSaga() {
  yield takeEvery(GET_ANNOUNCEMENT, getAnnouncement);
}
export function* watchAddAnnouncementSaga() {
  yield takeEvery(ADD_ANNOUNCEMENT, addAnnouncement);
}
export function* watchDeleteAnnouncementSaga() {
  yield takeEvery(DELETE_ANNOUNCEMENT, deleteAnnouncement);
}

export function* watchPublishAnnouncementSaga() {
  yield takeEvery(PUBLISH_ANNOUNCEMENT, publishAnnouncement);
}

export function* watchUnPublishAnnouncementSaga() {
  yield takeEvery(UNPUBLISH_ANNOUNCEMENT, unPublishAnnouncement);
}
export function* watchUpdateAnnouncementSaga() {
  yield takeEvery(UPDATE_ANNOUNCEMENT, updateAnnouncement);
}

function* announcementSaga() {
  yield all([
    fork(watchGetAnnouncementSaga),
    fork(watchAddAnnouncementSaga),
    fork(watchDeleteAnnouncementSaga),
    fork(watchPublishAnnouncementSaga),
    fork(watchUnPublishAnnouncementSaga),
    fork(watchUpdateAnnouncementSaga),
  ]);
}

export default announcementSaga;
