import {USERSCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function ChangePassword(changePasswordData) {
  const response = await USERSCLIENT.changePassword(changePasswordData)
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
