import {USERSCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function ChangePasswordApi(changePasswordData) {
  const response = await USERSCLIENT.changePassword(changePasswordData)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      console.log('response...........', JSON.stringify(response));
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
      console.log('response........error...', JSON.stringify(error));
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
