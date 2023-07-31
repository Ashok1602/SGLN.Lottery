import { TRAINING_MODULES_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { checkHttpStatus } from "../../actions/apiUtils";
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import {
  GET_STRIPPED_MODULES,
  GET_TRAINING_MODULE,
  CREATE_TRAINING_MODULE,
  DELETE_TRAINING_MODULE,
  GET_TRAINING_MODULE_BY_ID,
} from "./actionTypes";
import {
  getStrippedModulesSuccess,
  getStrippedModulesFailure,
  getTrainingModulesSuccess,
  getTrainingModulesFailure,
  createTrainingModulesSuccess,
  createTrainingModulesFailure,
  deleteTrainingModulesSuccess,
  deleteTrainingModulesFailure,
  getTrainingModuleByIdSuccess,
  getTrainingModuleByIdFailure,
} from "./actions";

//get stripped training modules
function* getStrippedMoudles(formData) {
  try {
    const apiResponse = baseMethod(
      TRAINING_MODULES_CLIENT.getStripped(formData.payload),
      "",
      "",
      true
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getStrippedModulesSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getStrippedModulesFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getStrippedModulesFailure(errorData));
  }
}

//get training modules
function* getTrainingMoudles(formData) {
  try {
    const apiResponse = baseMethod(
      TRAINING_MODULES_CLIENT.get(formData.payload),
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
      yield put(getTrainingModulesSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getTrainingModulesFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(createTrainingModulesSuccess(errorData));
  }
}

//create training modules
function* createTrainingMoudle(formData) {
  try {
    const apiResponse = baseMethod(
      TRAINING_MODULES_CLIENT.create(formData.payload.title),
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
      yield put(createTrainingModulesSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(createTrainingModulesFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(createTrainingModulesFailure(errorData));
  }
}

//delete training modules
function* deleteTrainingMoudle(formData) {
  try {
    const apiResponse = baseMethod(
      TRAINING_MODULES_CLIENT.delete(formData.payload.id),
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
      yield put(deleteTrainingModulesSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(deleteTrainingModulesFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(deleteTrainingModulesFailure(errorData));
  }
}

//get training module by id
function* getModuleById(formData) {
  try {
    const apiResponse = baseMethod(
      TRAINING_MODULES_CLIENT.getById(formData.payload),
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
      yield put(getTrainingModuleByIdSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getTrainingModuleByIdFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getTrainingModuleByIdFailure(errorData));
  }
}
export function* watchGetStrippedModules() {
  yield takeEvery(GET_STRIPPED_MODULES, getStrippedMoudles);
}

export function* watchGetTrainingMoudles() {
  yield takeEvery(GET_TRAINING_MODULE, getTrainingMoudles);
}

export function* watchCreateTrainingMoudle() {
  yield takeEvery(CREATE_TRAINING_MODULE, createTrainingMoudle);
}

export function* watchDeleteTrainingMoudle() {
  yield takeEvery(DELETE_TRAINING_MODULE, deleteTrainingMoudle);
}
export function* watchGetModuleById() {
  yield takeEvery(GET_TRAINING_MODULE_BY_ID, getModuleById);
}

function* trainingModulesSaga() {
  yield all([
    fork(watchGetStrippedModules),
    fork(watchGetTrainingMoudles),
    fork(watchCreateTrainingMoudle),
    fork(watchDeleteTrainingMoudle),
    fork(watchGetModuleById),
  ]);
}

export default trainingModulesSaga;
