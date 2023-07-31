import {
  GET_TRAININGS,
  GET_TRAININGS_SUCCESS,
  GET_TRAININGS_FAILURE,
  GET_BY_ID_TRAINING,
  GET_BY_ID_TRAINING_SUCCESS,
  GET_BY_ID_TRAINING_FAILURE,
  ADD_VIDEO_TRAINING,
  ADD_VIDEO_TRAINING_SUCCESS,
  ADD_VIDEO_TRAINING_FAILURE,
  EDIT_VIDEO_TRAINING,
  EDIT_VIDEO_TRAINING_SUCCESS,
  EDIT_VIDEO_TRAINING_FAILURE,
  ADD_LIVE_TRAINING,
  ADD_LIVE_TRAINING_SUCCESS,
  ADD_LIVE_TRAINING_FAILURE,
  EDIT_LIVE_TRAINING,
  EDIT_LIVE_TRAINING_SUCCESS,
  EDIT_LIVE_TRAINING_FAILURE,
  PUBLISH_TRAINING,
  PUBLISH_TRAINING_SUCCESS,
  PUBLISH_TRAINING_FAILURE,
  UNPUBLISH_TRAINING,
  UNPUBLISH_TRAINING_SUCCESS,
  UNPUBLISH_TRAINING_FAILURE,
  ADD_INTERACTIVE_TRAINING,
  ADD_INTERACTIVE_TRAINING_SUCCESS,
  ADD_INTERACTIVE_TRAINING_FAILURE,
  GET_QUESTIONS_BY_ID,
  GET_QUESTIONS_BY_ID_SUCCESS,
  GET_QUESTIONS_BY_ID_FAILURE,
  GET_TRAINING_SLIDES_BY_ID,
  GET_TRAINING_SLIDES_BY_ID_SUCCESS,
  GET_TRAINING_SLIDES_BY_ID_FAILURE,
  EDIT_INTERACTIVE_TRAINING,
  EDIT_INTERACTIVE_TRAINING_SUCCESS,
  EDIT_INTERACTIVE_TRAINING_FAILURE,
} from "./actionTypes";

const initialState = {
  data: null,
  dataById: null,
  addVideoTrainingData: null,
  addLiveTrainingData: null,
  addInteractiveTrainingData: null,
  editVideoTrainingData: null,
  editLiveTrainingData: null,
  editInteractiveTrainingData: null,
  questionList: null,
  slidesList: null,
};

const trainings = (state = initialState, action) => {
  switch (action.type) {
    case GET_TRAININGS:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_TRAININGS_SUCCESS:
      state = {
        ...state,
        data: action.payload,
        dataById: null,
      };
      break;
    case GET_TRAININGS_FAILURE:
      state = { ...state, data: null };
      break;
    //get by id case
    case GET_BY_ID_TRAINING:
      state = {
        ...state,
        dataById: null,
      };
      break;
    case GET_BY_ID_TRAINING_SUCCESS:
      state = {
        ...state,
        dataById: action.payload,
      };
      break;
    case GET_BY_ID_TRAINING_FAILURE:
      state = { ...state, dataById: null };
      break;
    //create video training case
    case ADD_VIDEO_TRAINING:
      state = {
        ...state,
        addVideoTrainingData: null,
      };
      break;
    case ADD_VIDEO_TRAINING_SUCCESS:
      state = {
        ...state,
        addVideoTrainingData: action.payload,
      };
      break;
    case ADD_VIDEO_TRAINING_FAILURE:
      state = {
        ...state,
        addVideoTrainingData: null,
      };
      break;
    //edit video training case
    case EDIT_VIDEO_TRAINING:
      state = {
        ...state,
        editVideoTrainingData: null,
      };
      break;
    case EDIT_VIDEO_TRAINING_SUCCESS:
      state = {
        ...state,
        editVideoTrainingData: action.payload,
      };
      break;
    case EDIT_VIDEO_TRAINING_FAILURE:
      state = {
        ...state,
        editVideoTrainingData: null,
      };
      break;
    //create live training case
    case ADD_LIVE_TRAINING:
      state = {
        ...state,
        addLiveTrainingData: null,
      };
      break;
    case ADD_LIVE_TRAINING_SUCCESS:
      state = {
        ...state,
        addLiveTrainingData: action.payload,
      };
      break;
    case ADD_LIVE_TRAINING_FAILURE:
      state = {
        ...state,
        addLiveTrainingData: null,
      };
      break;
    //edit live training case
    case EDIT_LIVE_TRAINING:
      state = {
        ...state,
        editLiveTrainingData: null,
      };
      break;
    case EDIT_LIVE_TRAINING_SUCCESS:
      state = {
        ...state,
        editLiveTrainingData: action.payload,
      };
      break;
    case EDIT_LIVE_TRAINING_FAILURE:
      state = {
        ...state,
        editLiveTrainingData: null,
      };
      break;
    //create Interactive Training case
    case ADD_INTERACTIVE_TRAINING:
      state = {
        ...state,
        addInteractiveTrainingData: null,
      };
      break;
    case ADD_INTERACTIVE_TRAINING_SUCCESS:
      state = {
        ...state,
        addInteractiveTrainingData: action.payload,
      };
      break;
    case ADD_INTERACTIVE_TRAINING_FAILURE:
      state = {
        ...state,
        addInteractiveTrainingData: null,
      };
      break;
    //edit Interactive Training case
    case EDIT_INTERACTIVE_TRAINING:
      state = {
        ...state,
        editInteractiveTrainingData: null,
      };
      break;
    case EDIT_INTERACTIVE_TRAINING_SUCCESS:
      state = {
        ...state,
        editInteractiveTrainingData: action.payload,
      };
      break;
    case EDIT_INTERACTIVE_TRAINING_FAILURE:
      state = {
        ...state,
        editInteractiveTrainingData: null,
      };
      break;
    //publish training case
    case PUBLISH_TRAINING:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case PUBLISH_TRAINING_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case PUBLISH_TRAINING_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    //un publish training case
    case UNPUBLISH_TRAINING:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case UNPUBLISH_TRAINING_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case UNPUBLISH_TRAINING_FAILURE:
      state = {
        ...state,
        updateData: null,
      };
      break;
    //get questions by id
    case GET_QUESTIONS_BY_ID:
      state = {
        ...state,
        questionList: null,
      };
      break;
    case GET_QUESTIONS_BY_ID_SUCCESS:
      state = {
        ...state,
        questionList: action.payload,
      };
      break;
    case GET_QUESTIONS_BY_ID_FAILURE:
      state = { ...state, questionList: null };
      break;
    //get slides by id
    case GET_TRAINING_SLIDES_BY_ID:
      state = {
        ...state,
        slidesList: null,
      };
      break;
    case GET_TRAINING_SLIDES_BY_ID_SUCCESS:
      state = {
        ...state,
        slidesList: action.payload,
      };
      break;
    case GET_TRAINING_SLIDES_BY_ID_FAILURE:
      state = { ...state, slidesList: null };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default trainings;
