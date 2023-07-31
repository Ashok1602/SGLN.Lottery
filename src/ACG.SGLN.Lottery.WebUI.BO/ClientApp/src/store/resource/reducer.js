import {
  GET_RESOURCE,
  RESOURCE_SUCCESS,
  RESOURCE_FAILURE,
  GET_CATEGORIES_BY_NATURE,
  GET_CATEGORIES_BY_NATURE_SUCCESS,
  GET_CATEGORIES_BY_NATURE_FAILURE,
} from './actionTypes';

const initialState = {
  data: null,
};

const resource = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESOURCE:
      state = {
        ...state,
        data: null,
        categoriesData: null
      };
      break;
    case RESOURCE_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case RESOURCE_FAILURE:
      state = { ...state, data: null };
      break;
    case GET_CATEGORIES_BY_NATURE:
      state = {
        ...state,
        categoriesData: null,
      };
      break;
    case GET_CATEGORIES_BY_NATURE_SUCCESS:
      state = {
        ...state,
        categoriesData: action.payload,
      };
      break;
    case GET_CATEGORIES_BY_NATURE_FAILURE:
      state = { ...state, categoriesData: null };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default resource;
