import {OBJECT_CONSTANTS} from './object-constant';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case OBJECT_CONSTANTS.GET_OBJECT_SUCCESS:
      return {
        ...state,
        GetObjectSuccess: action.payload,
        GetObjectFail: null,
      };
    case OBJECT_CONSTANTS.GET_OBJECT_FAIL:
      return {
        ...state,
        GetObjectSuccess: null,
        GetObjectFail: action.payload,
      };
    default:
      return state;
  }
}
