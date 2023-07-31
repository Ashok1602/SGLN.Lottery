import { INCENTIVE_CLIENT } from '../../actions/config';
import { takeEvery, fork, put, all, call } from 'redux-saga/effects';
import { checkHttpStatus } from '../../actions/apiUtils';
// Login Redux States
import { baseMethod } from '../../services/BaseService';
import { GET_INCENTIVES } from './actionTypes';
import { getIncentiveSuccess, getIncentiveFailure } from './actions';
//get announcements api call
function* getIncentives(data) {
  const {
    startDate,
    endDate,
    minGoal,
    maxGoal,
    minAchievement,
    maxAchievement,
    retailerId,
  } = data.payload;
  try {
    const apiResponse = baseMethod(
      INCENTIVE_CLIENT.getIncentives(
        startDate,
        endDate,
        minGoal,
        maxGoal,
        minAchievement,
        maxAchievement,
        retailerId
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
      yield put(getIncentiveSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getIncentiveFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getIncentiveFailure(errorData));
  }
}

export function* watchGetIncentiveSaga() {
  yield takeEvery(GET_INCENTIVES, getIncentives);
}

function* incentiveSaga() {
  yield all([fork(watchGetIncentiveSaga)]);
}

export default incentiveSaga;
