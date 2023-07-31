import {NOTIFICATION, GET_AXIOS_INSTANCE} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';
import {NOTIFICATION_CONSTANTS} from '../../redux/notification/notification-constant';
import {
  Get_Notification_Success,
  Get_Notification_Failed,
} from '../../redux/notification/notification-action';

export const GetNotifications = () => async (dispatch, getState) => {
  GET_AXIOS_INSTANCE();
  await NOTIFICATION.get()
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      // console.log(
      //   'Response from get Get notification API : ',
      //   JSON.stringify(response.results),
      // );
      if (response.results) {
        dispatch(
          Get_Notification_Success(
            NOTIFICATION_CONSTANTS.GET_NOTIFICATION_SUCCESS,
            {
              response: {
                statusCode: 200,
                data: response.results,
              },
            },
          ),
        );
      } else {
        //   console.log(response.error.errorDescription);
        dispatch(
          Get_Notification_Failed(
            NOTIFICATION_CONSTANTS.GET_NOTIFICATION_FAIL,
            {
              error: {
                statusCode: response.error.error,
                statusText: response.error.errorDescription,
                isSuccess: response.isSuccess,
              },
            },
          ),
        );
      }
    })
    .catch(error => {
      console.log(
        'We got an Error in Catch Block Of get current logged user details file      :',
        JSON.stringify(error),
      );
      dispatch(
        Get_Notification_Failed(NOTIFICATION_CONSTANTS.GET_NOTIFICATION_FAIL, {
          error: {
            statusText: error,
            netWorkError: true,
          },
        }),
      );
    });
};
