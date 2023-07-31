import {TRAINING} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function GetQuestions(id) {
  const response = await TRAINING.getTrainingQuestionsById(id)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      // console.log('Get Questions API ....... ', JSON.stringify(response));
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
      console.warn('Error in  Get Questions API:....', error);
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
