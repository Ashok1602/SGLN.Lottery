import { TRAININGS_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { checkHttpStatus } from "../../actions/apiUtils";
import { validateRequest } from "../../helpers";
import { GlobalNotificationHandle } from "../../services/NotificationHandler";
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import {
  GET_TRAININGS,
  GET_BY_ID_TRAINING,
  ADD_VIDEO_TRAINING,
  EDIT_VIDEO_TRAINING,
  ADD_LIVE_TRAINING,
  EDIT_LIVE_TRAINING,
  PUBLISH_TRAINING,
  UNPUBLISH_TRAINING,
  ADD_INTERACTIVE_TRAINING,
  GET_TRAINING_SLIDES_BY_ID,
  GET_QUESTIONS_BY_ID,
  EDIT_INTERACTIVE_TRAINING
} from "./actionTypes";
import {
  getTrainingsSuccess,
  getTrainingsFailure,
  getTrainingByIdSuccess,
  getTrainingByIdFailure,
  addVideoTrainingSuccess,
  addVideoTrainingFailure,
  editVideoTrainingSuccess,
  editVideoTrainingFailure,
  addLiveTrainingSuccess,
  addLiveTrainingFailure,
  editLiveTrainingSuccess,
  editLiveTrainingFailure,
  publishTrainingSuccess,
  publishTrainingFailure,
  unPublishTrainingSuccess,
  unPublishTrainingFailure,
  addInteractiveTrainingSuccess,
  addInteractiveTrainingFailure,
  getTrainingSlidesByIdSuccess,
  getTrainingSlidesByIdFailure,
  getTrainingQuestionsByIdSuccess,
  getTrainingQuestionsByIdFailure,
  updateInteractiveTrainingSuccess,
  updateInteractiveTrainingFailure
} from "./actions";
import {TRANSLATE} from "../../constants";

//get trainings api call
function* getTrainings(data) {
  const { page, size, startDate, endDate, trainingType, moduleId, title } = data.payload;
  try {
    const apiResponse = baseMethod(TRAININGS_CLIENT.get(page, size, startDate, endDate, trainingType, title, moduleId ), "", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getTrainingsSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getTrainingsFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getTrainingsFailure(errorData));
  }
}

//get training by id api call
function* getTrainingById(data) {
  try {
    const apiResponse = baseMethod(TRAININGS_CLIENT.getById(data.payload), "", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getTrainingByIdSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getTrainingByIdFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getTrainingsFailure(errorData));
  }
}

//for add video trainings api call
function* addVideoTraining(formData) {
  try {
    validateRequest(formData.payload.requiredKeys, formData.payload);
    const apiResponse = baseMethod(TRAININGS_CLIENT.createVideoTraining(formData.payload),"", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(addVideoTrainingSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(addVideoTrainingFailure(responseData));
    }
  } catch (error) {
    GlobalNotificationHandle(500, error.message);
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(addVideoTrainingFailure(errorData));
  }
}

//for edit video trainings api call
function* editVideoTraining(formData) {
  const { id } = formData.payload;
  const data = {
    moduleId: formData.payload.moduleId,
    title: formData.payload.title,
    courseURI: formData.payload.courseURI,
  };
  try {
    const apiResponse = baseMethod(
      TRAININGS_CLIENT.editVideoTraining(id, data), "", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(editVideoTrainingSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(editVideoTrainingFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(editVideoTrainingFailure(errorData));
  }
}

//for add Live trainings api call
function* addLiveTraining(formData) {
  try {
    const {
      title,
      courseURI,
      startDate,
      endDate,
      supportDocument
    } = formData.payload;
    validateRequest(formData.payload.requiredKeys, formData.payload);
    const apiResponse = baseMethod(
      TRAININGS_CLIENT.createLiveTraining(
        title,
        courseURI,
        startDate,
        endDate,
        supportDocument
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
      yield put(addLiveTrainingSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(addLiveTrainingFailure(responseData));
    }
  } catch (error) {
    GlobalNotificationHandle(500, error.message);
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(addLiveTrainingFailure(errorData));
  }
}

//for edit live trainings api call
function* editLiveTraining(formData) {
  try {
    const {
      id,
      title,
      courseURI,
      startDate,
      endDate,
      moduleId,
      supportDocument,
    } = formData.payload;
    const apiResponse = baseMethod(
      TRAININGS_CLIENT.editLiveTraining(
        id,
        title,
        courseURI,
        startDate,
        endDate,
        moduleId,
        supportDocument
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
      yield put(editLiveTrainingSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(editLiveTrainingFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(editLiveTrainingFailure(errorData));
  }
}

//for publish training api call
function* publishTraining(formData) {
  try {
    const apiResponse = baseMethod(TRAININGS_CLIENT.publish(formData.payload.id),  TRANSLATE.t("SUCCESS_ALERT_MESG"), "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(publishTrainingSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(publishTrainingFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(publishTrainingFailure(errorData));
  }
}

//for un publish training api call
function* unPublishTraining(formData) {
  try {
    const apiResponse = baseMethod(TRAININGS_CLIENT.unpublish(formData.payload.id),  TRANSLATE.t("SUCCESS_ALERT_MESG"), "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(unPublishTrainingSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(unPublishTrainingFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(unPublishTrainingFailure(errorData));
  }
}

//for add Interactive Training api call
function* addInteractiveTraining(formData) {
  try {
    validateRequest(formData.payload.requiredKeys, formData.payload);
    const apiResponse = baseMethod(
      TRAININGS_CLIENT.createInteractiveTraining(formData.payload),
      TRANSLATE.t("TRAININGS.INTERACTIVE_TRAINING_SUCCESS_MESSAGE"),
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(addInteractiveTrainingSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(addInteractiveTrainingFailure(responseData));
    }
  } catch (error) {
    GlobalNotificationHandle(500, error.message);
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(addInteractiveTrainingFailure(errorData));
  }
}

//for edit Interactive Training api call
function* updateInteractiveTraining(formData) {
  try {
    const apiResponse = baseMethod(
      TRAININGS_CLIENT.editInteractiveTraining(formData.payload.id, formData.payload),
      TRANSLATE.t("TRAININGS.INTERACTIVE_TRAINING_UPDATE_SUCCESS_MESSAGE"),
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(updateInteractiveTrainingSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(updateInteractiveTrainingFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(updateInteractiveTrainingFailure(errorData));
  }
}

//get slides by id api call
function* getTrainingSlidesById(data) {
  try {
    const apiResponse = baseMethod(TRAININGS_CLIENT.getTrainingSlidesById(data.payload), "", "", true);
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getTrainingSlidesByIdSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getTrainingSlidesByIdFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getTrainingSlidesByIdFailure(errorData));
  }
}
//get questions by id api call
function* getTrainingQuestionsById(data) {
  try {
    const apiResponse = baseMethod(TRAININGS_CLIENT.getTrainingQuestionsById(data.payload), "", "", true);
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getTrainingQuestionsByIdSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getTrainingQuestionsByIdFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getTrainingQuestionsByIdFailure(errorData));
  }
}
export function* watchGetTrainingsSaga() {
  yield takeEvery(GET_TRAININGS, getTrainings);
}
export function* watchGetTrainingByIdSaga() {
  yield takeEvery(GET_BY_ID_TRAINING, getTrainingById);
}
export function* watchAddVideoTrainingSaga() {
  yield takeEvery(ADD_VIDEO_TRAINING, addVideoTraining);
}
export function* watchEditVideoTrainingSaga() {
  yield takeEvery(EDIT_VIDEO_TRAINING, editVideoTraining);
}
export function* watchAddLiveTrainingSaga() {
  yield takeEvery(ADD_LIVE_TRAINING, addLiveTraining);
}
export function* watchEditLiveTrainingSaga() {
  yield takeEvery(EDIT_LIVE_TRAINING, editLiveTraining);
}
export function* watchPublishTrainingSaga() {
  yield takeEvery(PUBLISH_TRAINING, publishTraining);
}
export function* watchUnPublishTrainingSaga() {
  yield takeEvery(UNPUBLISH_TRAINING, unPublishTraining);
}
export function* watchAddInteractiveTrainingSaga() {
  yield takeEvery(ADD_INTERACTIVE_TRAINING, addInteractiveTraining);
}
export function* watchUpdateInteractiveTrainingSaga() {
  yield takeEvery(EDIT_INTERACTIVE_TRAINING, updateInteractiveTraining);
}
export function* watchGetTrainingSlidesByIdSaga() {
  yield takeEvery(GET_TRAINING_SLIDES_BY_ID, getTrainingSlidesById);
}
export function* watchGetTrainingQuestionsByIdSaga() {
  yield takeEvery(GET_QUESTIONS_BY_ID, getTrainingQuestionsById);
}

function* trainingsSaga() {
  yield all([
    fork(watchGetTrainingsSaga),
    fork(watchGetTrainingByIdSaga),
    fork(watchAddVideoTrainingSaga),
    fork(watchEditVideoTrainingSaga),
    fork(watchAddLiveTrainingSaga),
    fork(watchEditLiveTrainingSaga),
    fork(watchPublishTrainingSaga),
    fork(watchUnPublishTrainingSaga),
    fork(watchAddInteractiveTrainingSaga),
    fork(watchUpdateInteractiveTrainingSaga),
    fork(watchGetTrainingSlidesByIdSaga),
    fork(watchGetTrainingQuestionsByIdSaga),
  ]);
}

export default trainingsSaga;
