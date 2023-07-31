import { DOCUMENTS_CLIENT, SUPPORT_DOCS_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { checkHttpStatus } from "../../actions/apiUtils";
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import {
  GET_DOCUMENTLIST,
  UPLOAD_DOCUMENT,
  DELETE_DOCUMENT,
} from "./actionTypes";
import {
  getDocumentListSuccess,
  getDocumentListFailure,
  uploadDocumentSuccess,
  uploadDocumentFailure,
  deleteDocumentSuccess,
  deleteDocumentFailure,
} from "./actions";
import {TRANSLATE} from "../../constants";

//get documentList api call
function* getDocsList(data) {
  const { page, size, minCreationDate, maxCreationDate, title, type } = data.payload;
  try {
    const apiResponse = baseMethod(
      SUPPORT_DOCS_CLIENT.get(
        page,
        size,
        title,
        type,
        minCreationDate,
        maxCreationDate,
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
      yield put(getDocumentListSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getDocumentListFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getDocumentListFailure(errorData));
  }
}

//for upload document
function* uploadDocument(formData) {
  const { imgData, type, spec } = formData.payload;
  try {
    const apiResponse = baseMethod(
      DOCUMENTS_CLIENT.upload(undefined, type, spec, imgData),
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
      yield put(uploadDocumentSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(uploadDocumentFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(uploadDocumentFailure(errorData));
  }
}

//for delete document
function* deleteDocument(formData) {
  const {type, id} = formData.payload;
  try {
    const apiResponse = baseMethod(
      DOCUMENTS_CLIENT.delete(type, id),
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
      yield put(deleteDocumentSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(deleteDocumentFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(deleteDocumentFailure(errorData));
  }
}

export function* watchGetDocsListSaga() {
  yield takeEvery(GET_DOCUMENTLIST, getDocsList);
}
export function* watchUploadDocSaga() {
  yield takeEvery(UPLOAD_DOCUMENT, uploadDocument);
}
export function* watchDeleteDocSaga() {
  yield takeEvery(DELETE_DOCUMENT, deleteDocument);
}

function* documentsSaga() {
  yield all([
    fork(watchGetDocsListSaga),
    fork(watchUploadDocSaga),
    fork(watchDeleteDocSaga),
  ]);
}

export default documentsSaga;
