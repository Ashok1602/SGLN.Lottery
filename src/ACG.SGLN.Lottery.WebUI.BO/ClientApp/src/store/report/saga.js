import { REPORT_MODULES_CLIENT } from '../../actions/config';
import { takeEvery, fork, put, all, call } from 'redux-saga/effects';
import { checkHttpStatus } from '../../actions/apiUtils';
import { baseMethod } from '../../services/BaseService';
import {
  GET_TRAINING_REPORT_BY_MODULE,
  GET_TRAINING_REPORT_BY_RETAILER,
  GET_TRAINING_REPORT_BY_INCENTIVE,
  GET_RATIO_REPORT,
  GET_REQUESTS_REPORT,
  GET_TIME_RQUESTS_REPORT,
  GET_RETAILER_REPORT,
} from './actionTypes';
import {
  trainingReportByModuleSuccess,
  trainingReportByModuleFailure,
  trainingReportByRetailerSuccess,
  trainingReportByRetailerFailure,
  reportByIncentiveSuccess,
  reportByIncentiveFailure,
  generateRatioReportsSuccess,
  generateRatioReportsFailure,
  generateRequestReportSuccess,
  generateRequestReportFailure,
  generateTimeRequestReportSuccess,
  generateTimeRequestReportFailure,
  getRetailerReportSuccess,
  getRetailerReportFailure
} from './actions';

// Generate Trainings By Module report
function* generateTrainingsByModuleReport(data) {
  const { moduleId, training, fromDate, toDate, documentFormat } = data.payload;
  try {
    const apiResponse = baseMethod(
      REPORT_MODULES_CLIENT.generateTrainingsByModuleReport(
        moduleId,
        training,
        fromDate,
        toDate,
        documentFormat
      ),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);

    if (response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(trainingReportByModuleSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(trainingReportByModuleFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(trainingReportByModuleFailure(errorData));
  }
}

// Generate Trainings By Retailer report
function* generateTrainingsByRetailerReport(data) {
  const { retailerId, internalRetailerCode, fromDate, toDate, documentFormat } =
    data.payload;
  try {
    const apiResponse = baseMethod(
      REPORT_MODULES_CLIENT.generateTrainingsByRetailerReport(
        retailerId,
        internalRetailerCode,
        fromDate,
        toDate,
        documentFormat
      ),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(trainingReportByRetailerSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(trainingReportByRetailerFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(trainingReportByRetailerFailure(errorData));
  }
}

// Generate report by incentive
function* reportByIncentive(data) {
  const { gameType, fromDate, toDate, documentFormat } = data.payload;
  try {
    const apiResponse = baseMethod(
      REPORT_MODULES_CLIENT.generateIncentivesReport(
        gameType,
        fromDate,
        toDate,
        documentFormat
      ),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(reportByIncentiveSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(reportByIncentiveFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(reportByIncentiveFailure(errorData));
  }
}

// Generate ratio requests report
function* generateRatioRequestReport(data) {
  const {
    retailerId,
    nature,
    requestCategoryId,
    requestObjectId,
    status,
    fromDate,
    toDate,
    documentFormat,
  } = data.payload;
  try {
    const apiResponse = baseMethod(
      REPORT_MODULES_CLIENT.generateRatioRequestsReport(
        retailerId,
        nature,
        requestCategoryId,
        requestObjectId,
        status,
        fromDate,
        toDate,
        documentFormat
      ),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);

    if (response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(generateRatioReportsSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(generateRatioReportsFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(generateRatioReportsFailure(errorData));
  }
}

// Generate Requests Report
function* generateRequestsReport(data) {
  const {
    retailerId,
    nature,
    requestCategoryId,
    requestObjectId,
    status,
    fromDate,
    toDate,
    documentFormat,
  } = data.payload;
  try {
    const apiResponse = baseMethod(
      REPORT_MODULES_CLIENT.generateRequestsReport(
        retailerId,
        nature,
        requestCategoryId,
        requestObjectId,
        status,
        fromDate,
        toDate,
        documentFormat
      ),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(generateRequestReportSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(generateRequestReportFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(generateRequestReportFailure(errorData));
  }
}

// Generate time processing request report
function* generateTimeRequestsReport(data) {
  const {
    retailerId,
    nature,
    requestCategoryId,
    requestObjectId,
    fromDate,
    toDate,
    documentFormat,
  } = data.payload;
  try {
    const apiResponse = baseMethod(
      REPORT_MODULES_CLIENT.generateProcessingTimeRequestsReport(
        retailerId,
        nature,
        requestCategoryId,
        requestObjectId,
        fromDate,
        toDate,
        documentFormat
      ),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(generateTimeRequestReportSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(generateTimeRequestReportFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(generateTimeRequestReportFailure(errorData));
  }
}

// Get retailer report
function* getRetailerReport(data) {
  const {
    fromDate,
    toDate,
  } = data.payload;
  try {
    const apiResponse = baseMethod(
      REPORT_MODULES_CLIENT.getRetailerReport(
        fromDate,
        toDate,
      ),
      '',
      '',
      ''
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (response) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getRetailerReportSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getRetailerReportFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRetailerReportFailure(errorData));
  }
}


export function* watchGenerateTrainingsByModuleReportSaga() {
  yield takeEvery(
    GET_TRAINING_REPORT_BY_MODULE,
    generateTrainingsByModuleReport
  );
}
export function* watchGenerateTrainingsByRetailerReportSaga() {
  yield takeEvery(
    GET_TRAINING_REPORT_BY_RETAILER,
    generateTrainingsByRetailerReport
  );
}

export function* watchGenerateIncentiveReportSaga() {
  yield takeEvery(GET_TRAINING_REPORT_BY_INCENTIVE, reportByIncentive);
}

export function* watchGenerateRatioReportSaga() {
  yield takeEvery(GET_RATIO_REPORT, generateRatioRequestReport);
}
export function* watchGenerateRequestsReportSaga() {
  yield takeEvery(GET_REQUESTS_REPORT, generateRequestsReport);
}

export function* watchGenerateTimeRequetsReportSaga() {
  yield takeEvery(GET_TIME_RQUESTS_REPORT, generateTimeRequestsReport);
}

export function* watchGetRetailerReportSaga() {
  yield takeEvery(GET_RETAILER_REPORT, getRetailerReport);
}

function* reportSaga() {
  yield all([
    fork(watchGenerateTrainingsByModuleReportSaga),
    fork(watchGenerateTrainingsByRetailerReportSaga),
    fork(watchGenerateIncentiveReportSaga),
    fork(watchGenerateRatioReportSaga),
    fork(watchGenerateRequestsReportSaga),
    fork(watchGenerateTimeRequetsReportSaga),
    fork(watchGetRetailerReportSaga)
  ]);
}

export default reportSaga;
