/* eslint-disable prettier/prettier */
import {AUTH_CLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function SignIn(formData) {
  const response = await AUTH_CLIENT.signIn(formData)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      // console.log(
      //   JSON.stringify(response) + 'response................................',
      // );
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
      console.log('Error in Login API : ', JSON.stringify(error));
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
