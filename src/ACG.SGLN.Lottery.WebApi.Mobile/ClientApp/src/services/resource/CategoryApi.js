import {RESOURCE_CLIENT, GET_AXIOS_INSTANCE} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function GetAllCategoryData(natureType) {
  console.log(natureType);
  const response = await RESOURCE_CLIENT.getCategoriesByNature(natureType)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response) {
        return {
          isSuccess: true,
          data: response,
        };
      } else {
        console.log(response.error.errorDescription);
        return {
          isSuccess: false,
          data: response,
        };
      }
    })
    .catch(error => {
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
