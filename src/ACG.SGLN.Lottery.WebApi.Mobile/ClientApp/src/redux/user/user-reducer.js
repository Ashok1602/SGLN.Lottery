import {GET_LOGIN_CONSTANTS} from './user-constant';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case GET_LOGIN_CONSTANTS.GET_LOGIN_SUCCESS:
      return {
        ...state,
        GetLoginSuccess: action.payload,
        GetLoginFail: null,
      };
    case GET_LOGIN_CONSTANTS.GET_LOGIN_FAIL:
      return {
        ...state,
        GetLoginSuccess: null,
        GetLoginFail: action.payload,
      };
    default:
      return state;
  }
}
