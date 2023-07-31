/* eslint-disable prettier/prettier */
import {GET_AXIOS_INSTANCE, RETAILERSCLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';
import {
  Set_currentUserDetails_Failed,
  Set_currentUserDetails_Success,
} from '../../redux/currentUser/currentUser-action';
import {CURRENT_USER_DETAILS_CONST} from '../../redux/currentUser/currentUser-constant';

export const getUserDetails = () => async (dispatch, getState) => {
  GET_AXIOS_INSTANCE();
  await RETAILERSCLIENT.getCurrentRetailer()
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      // console.log('Response from get User details API : ', response)
      if (response) {
        dispatch(
          Set_currentUserDetails_Success(
            CURRENT_USER_DETAILS_CONST.SET_CURRENTUSER_SUCCESS,
            {
              response: {
                statusCode: 200,
                data: response,
              },
            },
          ),
        );
      } else {
        //   console.log(response.error.errorDescription);
        dispatch(
          Set_currentUserDetails_Failed(
            CURRENT_USER_DETAILS_CONST.SET_CURRENTUSER_FAILED,
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
        Set_currentUserDetails_Failed(
          CURRENT_USER_DETAILS_CONST.SET_CURRENTUSER_FAILED,
          {
            error: {
              statusText: error,
              netWorkError: true,
            },
          },
        ),
      );
    });
};
