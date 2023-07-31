/* eslint-disable prettier/prettier */
import {INCENTIVE_CLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function GetClassification() {
  const response = await INCENTIVE_CLIENT.getRetailerClassification()
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      console.log(
        'response for Get Classification api : ',
        JSON.stringify(response),
      );
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
      console.warn(
        'got Error in Get Classification API : ',
        JSON.stringify(error),
      );
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
