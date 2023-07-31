import { REQUEST_OBJECT_CLIENT } from '../../actions/config';
import { takeEvery, fork, put, all, call } from 'redux-saga/effects';
import { checkHttpStatus } from '../../actions/apiUtils';
import { validateRequest } from "../../helpers";
import { GlobalNotificationHandle } from "../../services/NotificationHandler";
// Login Redux States
import { baseMethod } from '../../services/BaseService';
import {
  GET_APPLICATION_SETTING,
  ADD_APPLICATION_SETTING,
  DELETE_APPLICATION_SETTING,
  UPDATE_APPLICATION_SETTING,
  ACTIVATE_APPLICATION_SETTING,
  INACTIVATE_APPLICATION_SETTING,
} from './actionTypes';
import {
  getApplicationSettingsSuccess,
  getApplicationSettingsFailure,
  addApplicationSettingsSuccess,
  addApplicationSettingsFailure,
  updateApplicationSettingsSuccess,
  updateApplicationSettingsFailure,
  deleteApplicationSettingsSuccess,
  deleteApplicationSettingsFailure,
  activateApplicationSettingsSuccess,
  activateApplicationSettingsFailure,
  inActivateApplicationSettingsSuccess,
  inActivateApplicationSettingsFailure,
} from './actions';
import { TRANSLATE } from "../../constants";

//get application-settings api call
function* getApplicationSettings(formData) {
  const {page, size, title, requestCategory} = formData.payload;
  try {
    const apiResponse = baseMethod(
      REQUEST_OBJECT_CLIENT.get(page, size, title, requestCategory),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getApplicationSettingsSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getApplicationSettingsFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getApplicationSettingsFailure(errorData));
  }
}

//for create application-settings
function* addApplicationSettings(formData) {
  const { title, isExternal, coverImage, requestCategory, requiredKeys, processingDirection } = formData.payload;
  try {
    validateRequest(requiredKeys, formData.payload);
    const apiResponse = baseMethod(
      REQUEST_OBJECT_CLIENT.create(
        title,
        isExternal,
        requestCategory,
        coverImage,
        processingDirection
      ),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(addApplicationSettingsSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(addApplicationSettingsFailure(responseData));
    }
  } catch (error) {
    GlobalNotificationHandle(500, error.message);
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(addApplicationSettingsFailure(errorData));
  }
}
//for update application-settings
function* updateApplicationSettings(formData) {
  const { id, title, isExternal, requestCategory, coverImage, processingDirection } =
    formData.payload;
  try {
    const apiResponse = baseMethod(
      REQUEST_OBJECT_CLIENT.update(
        id,
        title,
        isExternal,
        requestCategory,
        coverImage,
        processingDirection
      ),
      TRANSLATE.t("SUCCESS_ALERT_MESG"),
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(updateApplicationSettingsSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(updateApplicationSettingsFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(updateApplicationSettingsFailure(errorData));
  }
}
//for delete application-settings
function* deleteApplicationSettings(formData) {
  try {
    const apiResponse = baseMethod(
      REQUEST_OBJECT_CLIENT.delete(formData.payload.id),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(deleteApplicationSettingsSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(deleteApplicationSettingsFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(deleteApplicationSettingsFailure(errorData));
  }
}

//for Activate application-settings
function* activateApplicationSettings(formData) {
  try {
    const apiResponse = baseMethod(
      REQUEST_OBJECT_CLIENT.activate(formData.payload.id),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(activateApplicationSettingsSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(activateApplicationSettingsFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(activateApplicationSettingsFailure(errorData));
  }
}
//for InActivate application-settings
function* inActivateApplicationSettings(formData) {
  try {
    const apiResponse = baseMethod(
      REQUEST_OBJECT_CLIENT.deactivate(formData.payload.id),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(inActivateApplicationSettingsSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(inActivateApplicationSettingsFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(inActivateApplicationSettingsFailure(errorData));
  }
}

export function* watchGetApplicationSettingsSaga() {
  yield takeEvery(GET_APPLICATION_SETTING, getApplicationSettings);
}
export function* watchAddApplicationSettingsSaga() {
  yield takeEvery(ADD_APPLICATION_SETTING, addApplicationSettings);
}
export function* watchDeleteApplicationSettingsSaga() {
  yield takeEvery(DELETE_APPLICATION_SETTING, deleteApplicationSettings);
}
export function* watchUpdateApplicationSettingsSaga() {
  yield takeEvery(UPDATE_APPLICATION_SETTING, updateApplicationSettings);
}
export function* watchActivateApplicationSettingsSaga() {
  yield takeEvery(ACTIVATE_APPLICATION_SETTING, activateApplicationSettings);
}
export function* watchInActivateApplicationSettingsSaga() {
  yield takeEvery(
    INACTIVATE_APPLICATION_SETTING,
    inActivateApplicationSettings
  );
}

function* applicationSettingsSaga() {
  yield all([
    fork(watchGetApplicationSettingsSaga),
    fork(watchAddApplicationSettingsSaga),
    fork(watchDeleteApplicationSettingsSaga),
    fork(watchUpdateApplicationSettingsSaga),
    fork(watchActivateApplicationSettingsSaga),
    fork(watchInActivateApplicationSettingsSaga),
  ]);
}

export default applicationSettingsSaga;
