import {
  GET_REQUESTS_COMMENT,
  GET_REQUESTS_COMMENT_SUCCESS,
  GET_REQUESTS_COMMENT_FAILURE,
  GET_REQUESTS_COMMENT_BY_ID,
  GET_REQUESTS_COMMENT_BY_ID_SUCCESS,
  GET_REQUESTS_COMMENT_BY_ID_FAILURE,
  CREATE_REQUESTS_COMMENT,
  CREATE_REQUESTS_COMMENT_SUCCESS,
  CREATE_REQUESTS_COMMENT_FAILURE,
  DELETE_REQUESTS_COMMENT,
  DELETE_REQUESTS_COMMENT_SUCCESS,
  DELETE_REQUESTS_COMMENT_FAILURE
} from './actionTypes';

const initialState = {
  data: null,
  userData: null,
  changePasswordSuccess: null
};

const RequestComment = (state = initialState, action) => {
  switch (action.type) {
    case GET_REQUESTS_COMMENT:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_REQUESTS_COMMENT_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_REQUESTS_COMMENT_FAILURE:
      state = { ...state, data: null };
      break;
    //getById
    case GET_REQUESTS_COMMENT_BY_ID:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_REQUESTS_COMMENT_BY_ID_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_REQUESTS_COMMENT_BY_ID_FAILURE:
      state = { ...state, data: null };
      break;
    //start
    case CREATE_REQUESTS_COMMENT:
      state = {
        ...state,
        createCommentSuccess: null,
      };
      break;
    case CREATE_REQUESTS_COMMENT_SUCCESS:
      state = {
        ...state,
        createCommentSuccess: action.payload,
      };
      break;
    case CREATE_REQUESTS_COMMENT_FAILURE:
      state = { ...state, createCommentSuccess: null };
      break;
    //close
    case DELETE_REQUESTS_COMMENT:
      state = {
        ...state,
        deleteCommentSuccess: null,
      };
      break;
    case DELETE_REQUESTS_COMMENT_SUCCESS:
      state = {
        ...state,
        deleteCommentSuccess: action.payload,
      };
      break;
    case DELETE_REQUESTS_COMMENT_FAILURE:
      state = { ...state, deleteCommentSuccess: null };
      break;
    default:
      state = { ...state, data: null};
      break;
  }
  return state;
};

export default RequestComment;
