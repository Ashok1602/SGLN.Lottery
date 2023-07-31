import {REQUESTCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function CreateRequest(
  requestNature,
  requestCategory,
  requestObjectId,
  description,
  documentFile,
  documentFileName,
  imageFile,
  imageName,
  audioFile,
  audioName,
) {
  const formData = {
    requestNature: requestNature,
    requestCategory: requestCategory,
    requestObjectId: requestObjectId,
    description: description,
    documentFileData: documentFile,
    documentFileName: documentFileName,
    imageFileData: imageFile,
    imageFileName: imageName,
    audioFileData: audioFile,
    audioFileName: audioName,
  };
  //   1000-->Size
  // 1-->Page
  // Formation-->Null
  // Formation a distance-->
  // Upcoming-->minStartDate,null....,
  // Completed-->maxEndDate,null....
  // All-->Null....
  const response = await REQUESTCLIENT.create(formData)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      //console.log('get create request....... ', JSON.stringify(response));
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
