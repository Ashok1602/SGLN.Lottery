import { REQUEST_CATEGORY_CLIENT } from "../../actions/config";
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { checkHttpStatus } from "../../actions/apiUtils";
import { validateRequest } from "../../helpers"
// Login Redux States
import { baseMethod } from "../../services/BaseService";
import {
  GET_CATEGORY,
  DELETE_CATEGORY,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  ACTIVATE_CATEGORY,
  INACTIVATE_CATEGORY,
  STRIPPED_CATEGORY,
  STRIPPED_CATEGORY_BY_NATURE,
} from "./actionTypes";
import {
  getCategoriesSuccess,
  getCategoriesFailure,
  deleteCategorySuccess,
  deleteCategoryFailure,
  createCategorySuccess,
  createCategoryFailure,
  updateCategorySuccess,
  updateCategoryFailure,
  activateCategorySuccess,
  activateCategoryFailure,
  inactivateCategorySuccess,
  inactivateCategoryFailure,
  getStrippedCategorySuccess,
  getStrippedCategoryFailure,
  getStrippedCategoryByNatureSuccess,
  getStrippedCategoryByNatureFailure
} from "./actions";
import { TRANSLATE } from "../../constants";

function* getCategories(data) {
  try {
    const { page, size, title, requestNature } = data.payload;
    const apiResponse = baseMethod(
      REQUEST_CATEGORY_CLIENT.get(page, size, title, requestNature), "", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getCategoriesSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getCategoriesFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getCategoriesFailure(errorData));
  }
}

//delete user
function* deleteCategory(formData) {
  try {
    const { id } = formData.payload;
    const apiResponse = baseMethod(REQUEST_CATEGORY_CLIENT.delete(id), "", "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(deleteCategorySuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(deleteCategoryFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(deleteCategoryFailure(errorData));
  }
}

//create category
function* createCategory(formData) {
  try {
    validateRequest(formData.payload.requiredKeys, formData.payload);
    const { requestNature, title, coverImage} = formData.payload;
    const apiResponse = baseMethod(REQUEST_CATEGORY_CLIENT.create(requestNature, title, coverImage),  TRANSLATE.t("SUCCESS_ALERT_MESG"), "", "");
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(createCategorySuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(createCategoryFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(createCategoryFailure(errorData));
  }
}

//Update category
function* updateCategory(formData) {
  const {requestNature, id, title, coverImage} = formData.payload;
  try {
    const apiResponse = baseMethod(
      REQUEST_CATEGORY_CLIENT.update(requestNature, title, coverImage, id),
      TRANSLATE.t("SUCCESS_ALERT_MESG"),
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(updateCategorySuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(updateCategoryFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(updateCategoryFailure(errorData));
  }
}

//Activate category
function* activateCategory(formData) {
  try {
    const apiResponse = baseMethod(
      REQUEST_CATEGORY_CLIENT.activate(formData.payload.id),
      "",
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(activateCategorySuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(activateCategoryFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(activateCategoryFailure(errorData));
  }
}

//In Activate category
function* inActivateCategory(formData) {
  try {
    const apiResponse = baseMethod(
      REQUEST_CATEGORY_CLIENT.deactivate(formData.payload.id),
      "",
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(inactivateCategorySuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(inactivateCategoryFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(inactivateCategoryFailure(errorData));
  }
}

//get stripped categories
function* getStrippedCategory() {
  try {
    const apiResponse = baseMethod(
      REQUEST_CATEGORY_CLIENT.getStripped(),
      "",
      "",
      ""
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getStrippedCategorySuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getStrippedCategoryFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getStrippedCategoryFailure(errorData));
  }
}

//get stripped categories by nature
function* getStrippedCategoryByNature(formData) {
  try {
    const apiResponse = baseMethod(
      REQUEST_CATEGORY_CLIENT.getStrippedByNature(formData.payload),
      "",
      "",
      false
    );
    const response = yield call(checkHttpStatus, apiResponse);
    if (!response.status) {
      const responseData = {
        statusCode: 200,
        data: response,
      };
      yield put(getStrippedCategoryByNatureSuccess(responseData));
    } else {
      const responseData = {
        statusCode: response.statusCode || 400,
        data: response.data,
      };
      yield put(getStrippedCategoryByNatureFailure(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getStrippedCategoryByNatureFailure(errorData));
  }
}

export function* watchGetCategories() {
  yield takeEvery(GET_CATEGORY, getCategories);
}

export function* watchDeleteCategory() {
  yield takeEvery(DELETE_CATEGORY, deleteCategory);
}

export function* watchCreateCategory() {
  yield takeEvery(CREATE_CATEGORY, createCategory);
}

export function* watchUpdateCategory() {
  yield takeEvery(UPDATE_CATEGORY, updateCategory);
}

export function* watchActiveCategory() {
  yield takeEvery(ACTIVATE_CATEGORY, activateCategory);
}

export function* watchInativeCategory() {
  yield takeEvery(INACTIVATE_CATEGORY, inActivateCategory);
}

export function* watchGetStrippedCategories() {
  yield takeEvery(STRIPPED_CATEGORY, getStrippedCategory);
}

export function* watchGetStrippedCategoriesByNature() {
  yield takeEvery(STRIPPED_CATEGORY_BY_NATURE, getStrippedCategoryByNature);
}

function* usersSaga() {
  yield all([fork(watchGetCategories)]);
  yield all([fork(watchDeleteCategory)]);
  yield all([fork(watchCreateCategory)]);
  yield all([fork(watchUpdateCategory)]);
  yield all([fork(watchActiveCategory)]);
  yield all([fork(watchInativeCategory)]);
  yield all([fork(watchGetStrippedCategories)]);
  yield all([fork(watchGetStrippedCategoriesByNature)]);
}
export default usersSaga;
