import {GET_RESOURCE_CONSTANTS} from './resource-constant';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case GET_RESOURCE_CONSTANTS.GET_RESOURCE_SUCCESS:
      return {
        ...state,
        GetResourceSuccess: action.payload,
        GetResourceFail: null,
      };
    case GET_RESOURCE_CONSTANTS.GET_RESOURCE_FAIL:
      return {
        ...state,
        GetResourceSuccess: null,
        GetResourceFail: action.payload,
      };
    default:
      return state;
  }
}
