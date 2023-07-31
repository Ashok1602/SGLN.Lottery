import {REQUEST_CONSTANTS} from './request-constant';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case REQUEST_CONSTANTS.GET_REQUEST_SUCCESS:
      return {
        ...state,
        GetRequestSuccess: action.payload,
        GetRequestFail: null,
      };
    case REQUEST_CONSTANTS.GET_REQUEST_FAIL:
      return {
        ...state,
        GetRequestSuccess: null,
        GetRequestFail: action.payload,
      };
    default:
      return state;
  }
}
