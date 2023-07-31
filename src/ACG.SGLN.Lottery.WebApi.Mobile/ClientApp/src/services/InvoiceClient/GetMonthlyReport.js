/* eslint-disable prettier/prettier */
import {INVOICE_CLIENT} from '../serviceHelper/Config';
import {checkHttpStatus, parseJSON} from '../serviceHelper/ApiUtils';

export async function GetByMonth(startDate, endDate) {
  const response = await INVOICE_CLIENT.getByDate(startDate, endDate)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      console.log(
        'response for Get Invoices BY MONTH api : ',
        JSON.stringify(response),
      );
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
      console.warn(
        'got Error in Get Invoices BY MONTH API : ',
        JSON.stringify(error),
      );
      return {
        isSuccess: false,
        data: error,
      };
    });
  return response;
}
