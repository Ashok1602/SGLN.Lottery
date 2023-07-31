import {REQUESTCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';
import {REQUEST_CONSTANTS} from '../../redux/request/request-constant';
import {
  Get_Request_Success,
  Get_Request_Failed,
} from '../../redux/request/request-action';

export const GetAllRequestData = () => async (dispatch, getState) => {
  const response = await REQUESTCLIENT.get()
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      //console.log('get request list....... ', JSON.stringify(response));
      if (response.results) {
        dispatch(
          Get_Request_Success(REQUEST_CONSTANTS.GET_REQUEST_SUCCESS, {
            response: {
              statusCode: 200,
              data: response,
            },
          }),
        );
      } else {
        dispatch(
          Get_Request_Failed(REQUEST_CONSTANTS.GET_REQUEST_FAIL, {
            error: {
              statusCode: response.error.error,
              statusText: response.error.errorDescription,
              isSuccess: response.isSuccess,
            },
          }),
        );
      }
    })
    .catch(error => {
      // console.log('get request list....... ', JSON.stringify(error));
      dispatch(
        Get_Request_Failed(REQUEST_CONSTANTS.GET_REQUEST_FAIL, {
          error: {
            statusText: error,
            netWorkError: true,
          },
        }),
      );
    });
  return response;
};
