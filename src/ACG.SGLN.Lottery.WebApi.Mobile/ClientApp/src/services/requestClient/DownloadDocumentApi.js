import {DOCUMENTCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function DownloadDocument(id, isThumbnail) {
  const response = await DOCUMENTCLIENT.download(id, isThumbnail)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      //console.log('get Download data....... ', JSON.stringify(response));
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
      console.log('download document  data error....... ', error);
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
