import {
  GET_STRIPPED_MODULES,
  GET_STRIPPED_MODULES_SUCCESS,
  GET_STRIPPED_MODULES_FAILURE,
  GET_TRAINING_MODULE,
  GET_TRAINING_MODULE_SUCCESS,
  GET_TRAINING_MODULE_FAILURE,
  CREATE_TRAINING_MODULE,
  CREATE_TRAINING_MODULE_SUCCESS,
  CREATE_TRAINING_MODULE_FAILURE,
  DELETE_TRAINING_MODULE,
  DELETE_TRAINING_MODULE_SUCCESS,
  DELETE_TRAINING_MODULE_FAILURE,
  GET_TRAINING_MODULE_BY_ID,
  GET_TRAINING_MODULE_BY_ID_SUCCESS,
  GET_TRAINING_MODULE_BY_ID_FAILURE,
} from "./actionTypes";

const initialState = {
  data: [],
  moduleList: null,
  updateData: null,
  record: null,
};

const trainingMoudle = (state = initialState, action) => {
  switch (action.type) {
    //get stipped training modules
    case GET_STRIPPED_MODULES:
      state = {
        ...state,
        data: [],
      };
      break;
    case GET_STRIPPED_MODULES_SUCCESS:
      state = {
        ...state,
        data: action.payload ? action.payload.data : [],
      };
      break;
    case GET_STRIPPED_MODULES_FAILURE:
      state = { ...state, data: [] };
      break;
    //get training modules
    case GET_TRAINING_MODULE:
      state = {
        ...state,
        moduleList: null,
      };
      break;
    case GET_TRAINING_MODULE_SUCCESS:
      state = {
        ...state,
        moduleList: action.payload,
      };
      break;
    case GET_TRAINING_MODULE_FAILURE:
      state = { ...state, moduleList: null };
      break;
    //create training modules
    case CREATE_TRAINING_MODULE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case CREATE_TRAINING_MODULE_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case CREATE_TRAINING_MODULE_FAILURE:
      state = { ...state, updateData: null };
      break;
    //delete training modules
    case DELETE_TRAINING_MODULE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case DELETE_TRAINING_MODULE_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case DELETE_TRAINING_MODULE_FAILURE:
      state = { ...state, updateData: null };
      break;
    //get training module by Id
    case GET_TRAINING_MODULE_BY_ID:
      state = {
        ...state,
        record: null,
      };
      break;
    case GET_TRAINING_MODULE_BY_ID_SUCCESS:
      state = {
        ...state,
        record: action.payload,
      };
      break;
    case GET_TRAINING_MODULE_BY_ID_FAILURE:
      state = { ...state, record: null };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default trainingMoudle;
