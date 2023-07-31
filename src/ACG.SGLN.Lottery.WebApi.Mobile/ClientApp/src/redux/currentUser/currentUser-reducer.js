import {CURRENT_USER_DETAILS_CONST} from './currentUser-constant';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case CURRENT_USER_DETAILS_CONST.SET_CURRENTUSER_SUCCESS:
      return {
        ...state,
        GetCurrentuserDetailsSuccess: action.payload,
        GetCurrentuserDetailsFail: null,
      };
    case CURRENT_USER_DETAILS_CONST.SET_CURRENTUSER_FAILED:
      return {
        ...state,
        GetCurrentuserDetailsSuccess: null,
        GetCurrentuserDetailsFail: action.payload,
      };
    case CURRENT_USER_DETAILS_CONST.RESET_CURRENTUSER_DETAILS:
      return {
        ...state,
        GetCurrentuserDetailsSuccess: null,
        GetCurrentuserDetailsFail: null,
      };
    default:
      return state;
  }
}
