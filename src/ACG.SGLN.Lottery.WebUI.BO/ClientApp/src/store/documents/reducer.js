import {
  GET_DOCUMENTLIST,
  GET_DOCUMENTLIST_SUCCESS,
  GET_DOCUMENTLIST_FAILURE,
  UPLOAD_DOCUMENT,
  UPLOAD_DOCUMENT_SUCCESS,
  UPLOAD_DOCUMENT_FAILURE,
  DELETE_DOCUMENT,
  DELETE_DOCUMENT_SUCCESS,
  DELETE_DOCUMENT_FAILURE,
} from "./actionTypes";

const initialState = {
  data: null
};

const documents = (state = initialState, action) => {
  switch (action.type) {
    case GET_DOCUMENTLIST:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_DOCUMENTLIST_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_DOCUMENTLIST_FAILURE:
      state = { ...state, data: null };
      break;

    //upload docs case
    case UPLOAD_DOCUMENT:
      state = {
        ...state,
        createData: null,
      };
      break;
    case UPLOAD_DOCUMENT_SUCCESS:
      state = {
        ...state,
        createData: action.payload,
      };
      break;
    case UPLOAD_DOCUMENT_FAILURE:
      state = {
        ...state,
        createData: null,
      };
      break;
    
    //Delete announcement case
    case DELETE_DOCUMENT:
      state = {
        ...state,
        deleteData: null,
      };
      break;
    case DELETE_DOCUMENT_SUCCESS:
      state = {
        ...state,
        deleteData: action.payload,
      };
      break;
    case DELETE_DOCUMENT_FAILURE:
      state = {
        ...state,
        deleteData: null,
      };
      break;
        default:
      state = { ...state };
      break;
  }
  return state;
};

export default documents;
