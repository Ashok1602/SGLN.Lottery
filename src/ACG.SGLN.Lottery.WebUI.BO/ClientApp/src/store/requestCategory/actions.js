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

export const getCategories = (payload) => {
  return {
    type: GET_CATEGORY,
    payload: payload,
  };
};

export const getCategoriesSuccess = (response) => {
  return {
    type: GET_CATEGORY_SUCCESS,
    payload: response,
  };
};

export const getCategoriesFailure = (error) => {
  return {
    type: GET_CATEGORY_FAILURE,
    payload: error,
  };
};

export const createCategory = (payload) => {
  return {
    type: CREATE_CATEGORY,
    payload: payload,
  };
};

export const createCategorySuccess = (response) => {
  return {
    type: CREATE_CATEGORY_SUCCESS,
    payload: response,
  };
};

export const createCategoryFailure = (error) => {
  return {
    type: CREATE_CATEGORY_FAILURE,
    payload: error,
  }
};

export const deleteCategory = (formData) => {
  return {
    type: DELETE_CATEGORY,
    payload: formData,
  };
};

export const deleteCategorySuccess = (response) => {
  return {
    type: DELETE_CATEGORY_SUCCESS,
    payload: response,
  };
};

export const deleteCategoryFailure = (error) => {
  return {
    type: DELETE_CATEGORY_FAILURE,
    payload: error,
  };
};


export const updateCategory = (formData) => {
  return {
    type: UPDATE_CATEGORY,
    payload: formData,
  };
};

export const updateCategorySuccess = (response) => {
  return {
    type: UPDATE_CATEGORY_SUCCESS,
    payload: response,
  };
};

export const updateCategoryFailure = (error) => {
  return {
    type: UPDATE_CATEGORY_FAILURE,
    payload: error,
  };
};

export const activateCategory = (formData) => {
  return {
    type: ACTIVATE_CATEGORY,
    payload: formData,
  };
};

export const activateCategorySuccess = (response) => {
  return {
    type: ACTIVATE_CATEGORY_SUCCESS,
    payload: response,
  };
};

export const activateCategoryFailure = (error) => {
  return {
    type: ACTIVATE_CATEGORY_FAILURE,
    payload: error,
  };
};

export const inactivateCategory = (formData) => {
  return {
    type: INACTIVATE_CATEGORY,
    payload: formData,
  };
};

export const inactivateCategorySuccess = (response) => {
  return {
    type: INACTIVATE_CATEGORY_SUCCESS,
    payload: response,
  };
};

export const inactivateCategoryFailure = (error) => {
  return {
    type: INACTIVATE_CATEGORY_FAILURE,
    payload: error,
  };
};


export const getStrippedCategory = (formData) => {
  return {
    type: STRIPPED_CATEGORY,
    payload: formData,
  };
};

export const getStrippedCategorySuccess = (response) => {
  return {
    type: STRIPPED_CATEGORY_SUCCESS,
    payload: response,
  };
};

export const getStrippedCategoryFailure = (error) => {
  return {
    type: STRIPPED_CATEGORY_FAILURE,
    payload: error,
  };
};


export const getStrippedCategoryByNature = (formData) => {
  return {
    type: STRIPPED_CATEGORY_BY_NATURE,
    payload: formData,
  };
};

export const getStrippedCategoryByNatureSuccess = (response) => {
  return {
    type: STRIPPED_CATEGORY_BY_NATURE_SUCCESS,
    payload: response,
  };
};

export const getStrippedCategoryByNatureFailure = (error) => {
  return {
    type: STRIPPED_CATEGORY_BY_NATURE_FAILURE,
    payload: error,
  };
};