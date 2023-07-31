import {
  GET_INCENTIVES,
  GET_INCENTIVES_SUCCESS,
  GET_INCENTIVES_FAILURE,
} from "./actionTypes";

const initialState = {
  data: null,
};

const incentive = (state = initialState, action) => {
  switch (action.type) {
    case GET_INCENTIVES:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_INCENTIVES_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_INCENTIVES_FAILURE:
      state = { ...state, data: null };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default incentive;
