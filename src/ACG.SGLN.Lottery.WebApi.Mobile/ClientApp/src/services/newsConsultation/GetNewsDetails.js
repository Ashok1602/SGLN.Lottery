/* eslint-disable prettier/prettier */
import {ANNOUNCEMENT_CLIENT, GET_AXIOS_INSTANCE} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';


export const getAnnoucementsDetails = async id => {
  GET_AXIOS_INSTANCE();
  const response = await ANNOUNCEMENT_CLIENT.getById(id)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      // console.log(
      //   'response for getAnnouncement by id api : ',
      //   JSON.stringify(response),
      // );
      if (response) {
        return {
          data: response,
          isSuccess: true,
        };
      } else {
        console.log(response.error.errorDescription);
        return {
          data: response,
          isSuccess: false,
        };
      }
    })
    .catch(error => {
      console.warn(
        'got Error in getAnnoucements By ID API : ',
        JSON.stringify(error),
      );
      return {
        data: error,
        isSuccess: false,
      };
    });
  return response;
};
