/* eslint-disable prettier/prettier */
import {DRAWER_VISIBILITY_CONST} from './drawer-changeColor-constant';

export default function reducer(
  state = {
    isDrawerVisible: false,
  },
  action,
) {
  switch (action.type) {
    case DRAWER_VISIBILITY_CONST.SHOW_DRAWER:
      return {
        ...state,
        isDrawerVisible: true,
      };
    case DRAWER_VISIBILITY_CONST.HIDE_DRAWER:
      return {
        ...state,
        isDrawerVisible: false,
      };
  }
  return state;
}
