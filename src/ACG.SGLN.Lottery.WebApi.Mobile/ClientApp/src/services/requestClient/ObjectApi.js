import {REQUEST_OBJECT_CLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function GetObjectData(categoryType) {
  const response = await REQUEST_OBJECT_CLIENT.getStrippedByCategory(categoryType)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response) {
        // console.log('response for Get Object :', JSON.stringify(response));
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
