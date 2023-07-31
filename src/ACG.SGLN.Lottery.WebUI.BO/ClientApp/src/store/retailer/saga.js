import { RETAILER_CLIENT } from '../../actions/config';
import { takeEvery, fork, put, all, call } from 'redux-saga/effects';
import { checkHttpStatus } from '../../actions/apiUtils';
// Login Redux States
import { baseMethod } from '../../services/BaseService';
import {
  GET_STRIPPED_RETAILER,
  GET_RETAILER,
  GET_RETAILER_BY_ID,
  GET_RETAILER_AGENT,
  ASSIGN_AGENT_TO_RETAILER,
  GET_FROM_FILE,
  ASSIGN_SALE_REPRESENTATIVE,
  GET_MUNCIPALITIES,
  MASS_ASSIGNMENT
} from './actionTypes';
import {
  getStrippedRetailerSuccess,
  getStrippedRetailerFailure,
  getRetailerSuccess,
  getRetailerFailure,
  getRetailerByIdSuccess,
  getRetailerByIdFailure,
  getRetailerAgentSuccess,
  getRetailerAgentFailure,
  assignAgentToRetailerSuccess,
  assignAgentToRetailerFailure,
  getFromFileSuccess,
  getFromFileFailure,
  assignSaleRepresentativeSuccess,
  assignSaleRepresentativeFailure,
  getMuncipalitiesSuccess,
  getMuncipalitiesFailure,
  massAssignmentSuccess,
  massAssignmentFailure
} from './actions';
import { TRANSLATE } from "../../constants";

// Get Stripped Retailer
function* getStrippedRetailer(formData) {
  try {
    const apiResponse = baseMethod(
      RETAILER_CLIENT.getStrippedRetailers(formData.payload),
      '',
      '',
      false
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getStrippedRetailerSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getStrippedRetailerFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getStrippedRetailerFailure(errorData));
  }
}

// Get Retailer
function* getRetailer(formData) {
  let { page, size, firstName, lastName, phone, isNotified } = formData.payload;
  try {
    const apiResponse = baseMethod(
      RETAILER_CLIENT.get(page, size, firstName, lastName, phone, isNotified),
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
      yield put(getRetailerSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getRetailerFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRetailerFailure(errorData));
  }
}
// Get Retailer by id
function* getRetailerById(formData) {
  try {
    const apiResponse = baseMethod(
      RETAILER_CLIENT.getById(formData.payload),
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
      yield put(getRetailerByIdSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getRetailerByIdFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRetailerByIdFailure(errorData));
  }
}

// Get Retailer Agent by id
function* getRetailerAgent(formData) {
  try {
    const apiResponse = baseMethod(
      RETAILER_CLIENT.getAgent(formData.payload),
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
      yield put(getRetailerAgentSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getRetailerAgentFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRetailerAgentFailure(errorData));
  }
}

// assign Agent to retailer
function* assignAgentToRetailer(formData) {
  try {
    const apiResponse = baseMethod(
      RETAILER_CLIENT.assignAgent(
        formData.payload.id,
        formData.payload.agentId
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
      yield put(assignAgentToRetailerSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(assignAgentToRetailerFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(assignAgentToRetailerFailure(errorData));
  }
}

// get retailer from file
function* getFromFile(formData) {
  const {excelFile} = formData.payload;
  try {
    const apiResponse = baseMethod(RETAILER_CLIENT.getFromFile(excelFile), '', '', '');
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getFromFileSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getFromFileFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getFromFileFailure(errorData));
  }
}

// assign sale representative
function* assignSaleRepresentative(formData) {
  const payload = { 
    sglnCommercialName : formData?.payload?.formData.sglnCommercialName,
    sglnCommercialMail : formData?.payload?.formData.sglnCommercialMail,
    sglnCommercialPhone : formData?.payload?.formData.sglnCommercialPhone,
    sisalCommercialName :formData?.payload?.formData.sisalCommercialName,
    sisalCommercialMail :formData?.payload?.formData.sisalCommercialMail,
    sisalCommercialPhone : formData?.payload?.formData.sisalCommercialPhone,
    isMassAssignement : formData?.payload?.formData.isMassAssignement,
    targetMunicipality: formData?.payload?.formData.targetMunicipality
  }
  try {
    const apiResponse = baseMethod(
      RETAILER_CLIENT.assignSalesRepresentative(
        formData.payload.id,
        payload
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
      yield put(assignSaleRepresentativeSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(assignSaleRepresentativeFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(assignSaleRepresentativeFailure(errorData));
  }
}

// get muncipalities
function* getMuncipalities() {
  try {
    const apiResponse = baseMethod(
      RETAILER_CLIENT.getMunicipalities(),
      '',
      '',
      false
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getMuncipalitiesSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getMuncipalitiesFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getMuncipalitiesFailure(errorData));
  }
}

// for mass assignment
function* massAssignment(formData) {
  const payload = { 
    sglnCommercialName : formData?.payload?.formData.sglnCommercialName,
    sglnCommercialMail : formData?.payload?.formData.sglnCommercialMail,
    sglnCommercialPhone : formData?.payload?.formData.sglnCommercialPhone,
    sisalCommercialName :formData?.payload?.formData.sisalCommercialName,
    sisalCommercialMail :formData?.payload?.formData.sisalCommercialMail,
    sisalCommercialPhone : formData?.payload?.formData.sisalCommercialPhone,
    isMassAssignement : formData?.payload?.formData.isMassAssignement,
    targetMunicipality: formData?.payload?.formData.targetMunicipality
  }
  try {
    const apiResponse = baseMethod(
      RETAILER_CLIENT.massAssignSalesRepresentative(
        payload
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
      yield put(massAssignmentSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(massAssignmentFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(massAssignmentFailure(errorData));
  }
}


export function* watchGetStrippedRetailer() {
  yield takeEvery(GET_STRIPPED_RETAILER, getStrippedRetailer);
}
export function* watchGetRetailer() {
  yield takeEvery(GET_RETAILER, getRetailer);
}
export function* watchGetRetailerById() {
  yield takeEvery(GET_RETAILER_BY_ID, getRetailerById);
}
export function* watchGetRetailerAgent() {
  yield takeEvery(GET_RETAILER_AGENT, getRetailerAgent);
}
export function* watchAssignAgentToRetailer() {
  yield takeEvery(ASSIGN_AGENT_TO_RETAILER, assignAgentToRetailer);
}
export function* watchgetFromFile() {
  yield takeEvery(GET_FROM_FILE, getFromFile);
}
export function* watchAssignSaleRepresentative() {
  yield takeEvery(ASSIGN_SALE_REPRESENTATIVE, assignSaleRepresentative);
}
export function* watchGetMuncipalities() {
  yield takeEvery(GET_MUNCIPALITIES, getMuncipalities);
}
export function* watchMassAssignment() {
  yield takeEvery(MASS_ASSIGNMENT, massAssignment);
}

function* retailerSaga() {
  yield all([
    fork(watchGetStrippedRetailer),
    fork(watchGetRetailer),
    fork(watchGetRetailerById),
    fork(watchGetRetailerAgent),
    fork(watchAssignAgentToRetailer),
    fork(watchgetFromFile),
    fork(watchAssignSaleRepresentative),
    fork(watchGetMuncipalities),
    fork(watchMassAssignment)
  ]);
}

export default retailerSaga;
