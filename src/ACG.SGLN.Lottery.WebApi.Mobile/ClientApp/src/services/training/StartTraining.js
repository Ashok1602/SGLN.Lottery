import {TRAINING} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function StartTraining(id) {
  const response = await TRAINING.start(id)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      // console.log('Start Training ....... ', JSON.stringify(response));
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
      console.warn('Error in  Start Training api:....', error);
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
