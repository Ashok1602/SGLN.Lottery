import {TRAINING} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function GetTrainingSlidesById(id) {
  const response = await TRAINING.getTrainingSlidesById(id)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      // console.log(
      //   'get training SLIDES module....... ',
      //   JSON.stringify(response),
      // );
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
      console.warn('Error in  training module api:....', error);
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
