import {REQUESTCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function AgainRequest(id, reason) {
  const response = await REQUESTCLIENT.contest(id, reason)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
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
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
