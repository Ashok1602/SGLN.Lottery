import { GET_ROLE, GET_ROLE_SUCCESS, GET_ROLE_FAILURE } from "./actionTypes";

const initialState = {
  data: null,
  createData: null,
  updateData: null,
};

const role = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROLE:
      state = {
        ...state,
        data: null,
      };
      break;
    case GET_ROLE_SUCCESS:
      state = {
        ...state,
        data: action.payload,
      };
      break;
    case GET_ROLE_FAILURE:
      state = { ...state, data: null };
      break;
    default:
      state = { ...state, createData: null, updateData: null };
      break;
  }
  return state;
};

export default role;
