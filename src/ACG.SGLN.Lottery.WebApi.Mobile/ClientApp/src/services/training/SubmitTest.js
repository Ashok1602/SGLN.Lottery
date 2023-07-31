import {TRAINING} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function submitTest(id, answerList) {
  // console.info('CALLED :', id, answerList);
  const response = await TRAINING.complete(id, answerList)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      // console.log('Submit Test Success ....... ', JSON.stringify(response));
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
      console.warn('Error in  Submit Test api:....', error);
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
