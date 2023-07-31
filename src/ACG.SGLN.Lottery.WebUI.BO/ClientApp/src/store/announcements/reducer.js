import {
  GET_ANNOUNCEMENT,
  GET_ANNOUNCEMENT_SUCCESS,
  GET_ANNOUNCEMENT_FAILURE,
  ADD_ANNOUNCEMENT,
  ADD_ANNOUNCEMENT_SUCCESS,
  ADD_ANNOUNCEMENT_FAILURE,
  UPDATE_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  PUBLISH_ANNOUNCEMENT,
  UNPUBLISH_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT_SUCCESS,
  UPDATE_ANNOUNCEMENT_FAILURE,
  DELETE_ANNOUNCEMENT_SUCCESS,
  DELETE_ANNOUNCEMENT_FAILURE,
  PUBLISH_ANNOUNCEMENT_SUCCESS,
  PUBLISH_ANNOUNCEMENT_FAILURE,
  UNPUBLISH_ANNOUNCEMENT_SUCCESS,
  UNPUBLISH_ANNOUNCEMENT_FAILURE,
} from "./actionTypes";

const initialState = {
  data: null,
  createData: null,
  updateData: null
};

const announcement = (state = initialState, action) => {
  switch (action.type) {
    case GET_ANNOUNCEMENT:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_ANNOUNCEMENT_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_ANNOUNCEMENT_FAILURE:
      state = { ...state, data: null };
      break;
    //create announcement case
    case ADD_ANNOUNCEMENT:
      state = {
        ...state,
        createData: null,
      };
      break;
    case ADD_ANNOUNCEMENT_SUCCESS:
      state = {
        ...state,
        createData: action.payload,
      };
      break;
    case ADD_ANNOUNCEMENT_FAILURE:
      state = {
        ...state,
        createData: null,
      };
      break;
    // update case
    case UPDATE_ANNOUNCEMENT:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case UPDATE_ANNOUNCEMENT_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case UPDATE_ANNOUNCEMENT_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    //Delete announcement case
    case DELETE_ANNOUNCEMENT:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case DELETE_ANNOUNCEMENT_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case DELETE_ANNOUNCEMENT_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    //Publish announcement case
    case PUBLISH_ANNOUNCEMENT:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case PUBLISH_ANNOUNCEMENT_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case PUBLISH_ANNOUNCEMENT_FAILURE:
      state = {
        ...state,
        createData: null,
      };
      break;
    //un-publish announcement case
    case UNPUBLISH_ANNOUNCEMENT:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case UNPUBLISH_ANNOUNCEMENT_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case UNPUBLISH_ANNOUNCEMENT_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    default:
      state = { ...state, createData: null, updateData: null};
      break;
  }
  return state;
};

export default announcement;
