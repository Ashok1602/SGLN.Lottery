/* eslint-disable prettier/prettier */
import {CHANGE_COLOR_CONST} from '../bottomTab/changeColor-constant';

export default function reducer(
  state = {
    tabSelectedIndex: -1,
  },
  action,
) {
  switch (action.type) {
    case CHANGE_COLOR_CONST.CHANGE_SUCCESS:
      return {
        ...state,
        tabSelectedIndex: action.payload,
      };
    case CHANGE_COLOR_CONST.CHANGE_YELLOW_SUCCESS:
      return {
        ...state,
        toTabColor: action.payload,
      };
  }
  return state;
}
