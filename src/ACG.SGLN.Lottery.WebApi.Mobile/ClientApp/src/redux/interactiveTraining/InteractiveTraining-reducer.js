import {INT_FORMATION_DETAILS_CONST} from './InteractiveTraining-constant';

export default function reducer(
  state = {formationName: '', moduleName: ''},
  action,
) {
  switch (action.type) {
    case INT_FORMATION_DETAILS_CONST.SET_FORMATION_DETAILS_SUCCESS:
      return {
        ...state,
        formationName: action.payload,
      };
    case INT_FORMATION_DETAILS_CONST.SET_MODULENAME_SUCCESS:
      return {
        ...state,
        moduleName: action.payload,
      };
    case INT_FORMATION_DETAILS_CONST.RESET_FORMATION_DETAILS_DETAILS:
      return {
        ...state,
        formationName: null,
        moduleName: null,
      };
    default:
      return state;
  }
}
