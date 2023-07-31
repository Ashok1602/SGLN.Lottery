import {
  GET_CATEGORY,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILURE,
  CREATE_CATEGORY,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  DELETE_CATEGORY,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  UPDATE_CATEGORY,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  ACTIVATE_CATEGORY,
  ACTIVATE_CATEGORY_SUCCESS,
  ACTIVATE_CATEGORY_FAILURE,
  INACTIVATE_CATEGORY,
  INACTIVATE_CATEGORY_SUCCESS,
  INACTIVATE_CATEGORY_FAILURE,
  STRIPPED_CATEGORY,
  STRIPPED_CATEGORY_SUCCESS,
  STRIPPED_CATEGORY_FAILURE,
  STRIPPED_CATEGORY_BY_NATURE,
  STRIPPED_CATEGORY_BY_NATURE_SUCCESS,
  STRIPPED_CATEGORY_BY_NATURE_FAILURE
} from "./actionTypes";

const initialState = {
  data: null,
  userData: null,
  updateData: null,
  changePasswordSuccess: null,
  resetPasswordSuccess: null,
};

const Categories = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORY:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_CATEGORY_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_CATEGORY_FAILURE:
      state = { ...state, data: null };
      break;
    //Delete category case
    case DELETE_CATEGORY:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case DELETE_CATEGORY_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case DELETE_CATEGORY_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    // create case
    case CREATE_CATEGORY:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case CREATE_CATEGORY_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case CREATE_CATEGORY_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    // update case
    case UPDATE_CATEGORY:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case UPDATE_CATEGORY_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case UPDATE_CATEGORY_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    // Active user case
    case ACTIVATE_CATEGORY:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case ACTIVATE_CATEGORY_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case ACTIVATE_CATEGORY_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    // inActive user case
    case INACTIVATE_CATEGORY:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case INACTIVATE_CATEGORY_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case INACTIVATE_CATEGORY_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    // get stripped categories
    case STRIPPED_CATEGORY:
      state = {
        ...state,
        strippedData: null,
      };
      break;
    case STRIPPED_CATEGORY_SUCCESS:
      state = {
        ...state,
        strippedData: action.payload ? action.payload.data : null,
      };
      break;
    case STRIPPED_CATEGORY_FAILURE:
      state = {
        ...state,
        strippedData: null,
      };
      break;
    // get stripped categories
    case STRIPPED_CATEGORY_BY_NATURE:
      state = {
        ...state,
        strippedDataByNature: null,
      };
      break;
    case STRIPPED_CATEGORY_BY_NATURE_SUCCESS:
      state = {
        ...state,
        strippedDataByNature: action.payload ? action.payload.data : null,
      };
      break;
    case STRIPPED_CATEGORY_BY_NATURE_FAILURE:
      state = {
        ...state,
        strippedDataByNature: null,
      };
      break;
    default:
      state = {
        ...state,
        updateData: null,
        userData: null,
      };
      break;
  }
  return state;
};

export default Categories;
