import {USERSCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function ForgotPassword(email) {
  const response = await USERSCLIENT.forgotPassword(email)
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
