import {REQUESTCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function GetDocumentsData(id) {
  const response = await REQUESTCLIENT.getById(id)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      //console.log('get Document data....... ', JSON.stringify(response));
      if (response) {
        return {
          isSuccess: true,
          data: response,
        };
      } else {
        return {
          isSuccess: false,
          data: response,
        };
      }
    })
    .catch(error => {
      console.log('document data error....... ', error);
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
