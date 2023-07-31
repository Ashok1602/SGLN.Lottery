import {RETAILERSCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function SubscriptionApi(deviceToken) {
  const response = await RETAILERSCLIENT.activateNotification(deviceToken)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      // console.log(
      //   'get create request subscription....... ',
      //   JSON.stringify(response),
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
      console.warn('Error in  create request api:....', error);
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
