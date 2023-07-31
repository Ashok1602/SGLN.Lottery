import {GET_AXIOS_INSTANCE, OFF_DOCUMENTCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function GetDocs(type) {
  console.info(type);
  GET_AXIOS_INSTANCE();
  const response = await OFF_DOCUMENTCLIENT.get(
    1,
    1000,
    undefined,
    type,
    undefined,
    undefined,
  )
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response) {
        // console.log('Response from Docs API : ', response);
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
      console.warn('Error Response from Docs API : ', error);
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
