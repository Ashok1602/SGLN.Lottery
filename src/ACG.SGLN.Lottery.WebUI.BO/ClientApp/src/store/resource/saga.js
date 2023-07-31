import { RESOURCE_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from 'redux-saga/effects';
import { checkHttpStatus } from "../../actions/apiUtils";
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import { GET_RESOURCE,GET_CATEGORIES_BY_NATURE } from './actionTypes';
import { getResourceSuccess, getResourceFailure, getCategoriesByNatureSuccess,getCategoriesByNatureFailure } from './actions';


function* getResource() {
    try {
        const apiResponse = baseMethod(RESOURCE_CLIENT.get(), "", "", "");
        const response = yield call(checkHttpStatus, apiResponse);
        if (!response.status) {
          const responseData = {
            statusCode: 200,
            data: response,
          };
          localStorage.setItem("resourceInfo", JSON.stringify(response));
          yield put(getResourceSuccess(responseData));
        } else {
          const responseData = {
            statusCode: response.statusCode || 400,
            data: response.data,
          };
          yield put(getResourceFailure(responseData));
        }
    } catch (error) {
        const errorData = {
            error: {
              statusText: error,
              netWorkError: true,
            },
          };
          yield put(getResourceFailure(errorData));
    }
}
//getCategories by nature
function* getCategoriesByNature(nature) {
  try {
      const apiResponse = baseMethod(RESOURCE_CLIENT.getCategoriesByNature(nature.payload), "", "", "");
      const response = yield call(checkHttpStatus, apiResponse);
      if (!response.status) {
        const responseData = {
          statusCode: 200,
          data: response,
        };
        yield put(getCategoriesByNatureSuccess(responseData));
      } else {
        const responseData = {
          statusCode: response.statusCode || 400,
          data: response.data,
        };
        yield put(getCategoriesByNatureFailure(responseData));
      }
  } catch (error) {
      const errorData = {
          error: {
            statusText: error,
            netWorkError: true,
          },
        };
        yield put(getCategoriesByNatureFailure(errorData));
  }
}



export function* watchGetResource() {
    yield takeEvery(GET_RESOURCE, getResource)
}

export function* watchGetCategoriesByNature() {
  yield takeEvery(GET_CATEGORIES_BY_NATURE, getCategoriesByNature)
}

function* resourceSaga() {
    yield all([
        fork(watchGetResource),
        fork(watchGetCategoriesByNature),
    ]);
}

export default resourceSaga;