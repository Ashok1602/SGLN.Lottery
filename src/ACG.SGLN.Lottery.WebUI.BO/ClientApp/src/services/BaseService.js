import { GlobalNotificationHandle } from './NotificationHandler';
import { checkHttpStatus } from '../actions/apiUtils';
import store from '../store';
import { startLoader, stopLoader } from '../store/layout/loader/actions';
const axios = require('axios');
/**
 * httpservice url
 * @returns {*}
 */

export const httpServiceUrl = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

httpServiceUrl.defaults.withCredentials = true;

export const baseMethod = async (
  serviceMethod,
  successMsg,
  errorMsg,
  removeLoader
) => {
  if (!removeLoader) {
    store.dispatch(startLoader());
  }
  let requestData = await serviceMethod
    .then(checkHttpStatus)
    .then((response) => {
      if (response) {
        GlobalNotificationHandle(200, successMsg);
      }
      if (!removeLoader) {
        store.dispatch(stopLoader());
      }
      return response;
    }).catch((err) => {
      if (!removeLoader) {
        store.dispatch(stopLoader());
      }
      if (err.response) {
        GlobalNotificationHandle(
          err.response.data.status,
          err.response.data.detail
        );
      }
      return err.response;
    });
  return requestData;
};
