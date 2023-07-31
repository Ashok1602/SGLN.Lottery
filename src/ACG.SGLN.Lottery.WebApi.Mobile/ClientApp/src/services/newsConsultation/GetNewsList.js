/* eslint-disable prettier/prettier */
import {ANNOUNCEMENT_CLIENT, GET_AXIOS_INSTANCE} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function getAnnoucements(page, size) {
  GET_AXIOS_INSTANCE();
  const response = await ANNOUNCEMENT_CLIENT.get(page, size)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      console.log(
        'response for getAnnouncement api : ',
        JSON.stringify(response),
      );
      if (response.results) {
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
        'got Error in getAnnoucements API : ',
        JSON.stringify(error),
      );
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
