/* eslint-disable prettier/prettier */
import {INVOICE_CLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function GetInvoice() {
  const response = await INVOICE_CLIENT.getInvoices()
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      console.log('response for Get Invoices api : ', JSON.stringify(response));
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
      console.warn('got Error in Get Invoices API : ', JSON.stringify(error));
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
