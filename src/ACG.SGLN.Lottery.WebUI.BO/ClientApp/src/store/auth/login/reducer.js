import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_USER,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
} from './actionTypes';

const initialState = {
  isAuthenticating: false,
  loginData: null,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        isAuthenticating: false,
        loginData: null,
      };
      break;
    case LOGIN_SUCCESS:
      state = {
        ...state,
        isAuthenticating: true,
        loginData: action.payload.data,
      };
      break;
    case LOGIN_FAILURE:
      state = { ...state, isAuthenticating: false, loginData: null };
      break;
      case LOGOUT_USER:
        state = {
          ...state,
          logoutSuccess: null,
        };
        break;
      case LOGOUT_SUCCESS:
        state = {
          ...state,
          logoutSuccess: action.payload.data,
        };
        break;
      case LOGOUT_FAILURE:
        state = { ...state, logoutSuccess: null };
        break;
    default:
      state = { ...state, isAuthenticating: false, loginData: null };
      break;
  }
  return state;
};

export default login;
