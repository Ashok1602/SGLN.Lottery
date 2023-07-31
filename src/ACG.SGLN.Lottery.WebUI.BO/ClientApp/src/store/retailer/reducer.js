import {
  GET_STRIPPED_RETAILER,
  GET_STRIPPED_RETAILER_SUCCESS,
  GET_STRIPPED_RETAILER_FAILURE,
  GET_RETAILER,
  GET_RETAILER_SUCCESS,
  GET_RETAILER_FAILURE,
  GET_RETAILER_BY_ID,
  GET_RETAILER_BY_ID_SUCCESS,
  GET_RETAILER_BY_ID_FAILURE,
  GET_RETAILER_AGENT,
  GET_RETAILER_AGENT_SUCCESS,
  GET_RETAILER_AGENT_FAILURE,
  ASSIGN_AGENT_TO_RETAILER,
  ASSIGN_AGENT_TO_RETAILER_SUCCESS,
  ASSIGN_AGENT_TO_RETAILER_FAILURE,
  GET_FROM_FILE,
  GET_FROM_FILE_SUCCESS,
  GET_FROM_FILE_FAILURE,
  ASSIGN_SALE_REPRESENTATIVE,
  ASSIGN_SALE_REPRESENTATIVE_SUCCESS,
  ASSIGN_SALE_REPRESENTATIVE_FAILURE,
  GET_MUNCIPALITIES,
  GET_MUNCIPALITIES_SUCCESS,
  GET_MUNCIPALITIES_FAILURE,
  MASS_ASSIGNMENT,
  MASS_ASSIGNMENT_SUCCESS,
  MASS_ASSIGNMENT_FAILURE
} from "./actionTypes";

const initialState = {
  data: [],
  retailer: null,
  agent: null,
  updateData: null,
};

const retailer = (state = initialState, action) => {
  switch (action.type) {
    //Stripped Retailer
    case GET_STRIPPED_RETAILER:
      state = {
        ...state,
        data: [],
      };
      break;
    case GET_STRIPPED_RETAILER_SUCCESS:
      state = {
        ...state,
        data: action.payload ? action.payload.data : [],
      };
      break;
    case GET_STRIPPED_RETAILER_FAILURE:
      state = { ...state, data: [] };
      break;
    //get Retailer
    case GET_RETAILER:
      state = {
        ...state,
        data: [],
      };
      break;
    case GET_RETAILER_SUCCESS:
      state = {
        ...state,
        data: action.payload ? action.payload.data : [],
      };
      break;
    case GET_RETAILER_FAILURE:
      state = { ...state, data: [] };
      break;
    //get RetailerById
    case GET_RETAILER_BY_ID:
      state = {
        ...state,
        retailer: null,
      };
      break;
    case GET_RETAILER_BY_ID_SUCCESS:
      state = {
        ...state,
        retailer: action.payload,
      };
      break;
    case GET_RETAILER_BY_ID_FAILURE:
      state = { ...state, retailer: action.payload };
      break;
    //get Retailer Agent
    case GET_RETAILER_AGENT:
      state = {
        ...state,
        agent: null,
      };
      break;
    case GET_RETAILER_AGENT_SUCCESS:
      state = {
        ...state,
        agent: action.payload,
      };
      break;
    case GET_RETAILER_AGENT_FAILURE:
      state = { ...state, agent: action.payload };
      break;
    // Assign Agent to retailer Action
    case ASSIGN_AGENT_TO_RETAILER:
      state = {
        ...state,
        updateData: null,
      };
      break;
    case ASSIGN_AGENT_TO_RETAILER_SUCCESS:
      state = {
        ...state,
        updateData: action.payload,
      };
      break;
    case ASSIGN_AGENT_TO_RETAILER_FAILURE:
      state = { ...state, updateData: action.payload };
      break;
    //get retailer from file reducer
    case GET_FROM_FILE:
      state = {
        ...state,
        retailersData: null,
      };
      break;
    case GET_FROM_FILE_SUCCESS:
      state = {
        ...state,
        retailersData: action.payload ? action.payload.data : action.payload,
      };
      break;
    case GET_FROM_FILE_FAILURE:
      state = { ...state, retailersData: null };
      break;
    // Assign sale representative
    case ASSIGN_SALE_REPRESENTATIVE:
      state = {
        ...state,
        assignedData: null,
      };
      break;
    case ASSIGN_SALE_REPRESENTATIVE_SUCCESS:
      state = {
        ...state,
        assignedData: action.payload,
      };
      break;
    case ASSIGN_SALE_REPRESENTATIVE_FAILURE:
      state = { ...state, assignedData: action.payload };
      break;
    // get muncipalities
    case GET_MUNCIPALITIES:
      state = {
        ...state,
        muncipalitiesData: [],
      };
      break;
    case GET_MUNCIPALITIES_SUCCESS:
      state = {
        ...state,
        muncipalitiesData: action.payload?.data,
      };
      break;
    case GET_MUNCIPALITIES_FAILURE:
      state = { ...state, muncipalitiesData: [] };
      break;

    // for mass assignment
    case MASS_ASSIGNMENT:
      state = {
        ...state,
        massAssignmentData: null,
      };
      break;
    case MASS_ASSIGNMENT_SUCCESS:
      state = {
        ...state,
        massAssignmentData: action.payload?.data,
      };
      break;
    case MASS_ASSIGNMENT_FAILURE:
      state = { ...state, massAssignmentData: null };
      break;

    default:
      state = { ...state };
      break;
  }
  return state;
};

export default retailer;
