export function checkHttpStatus(response) {
  // console.info('Res in checkHttpStatus  :', response)
  if (response.status >= 500 && response.status < 600) {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  } else {
    return response;
  }
}

export function parseJSON(response) {
  // console.info('Res in parseJSON  :', response)
  return response;
}
