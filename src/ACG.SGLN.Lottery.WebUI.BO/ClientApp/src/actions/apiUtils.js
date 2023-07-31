export function checkHttpStatus(response) {
  if (response.status >= 500 && response.status < 600) {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  } else {
    return response;
  }
}

export function parseJSON(response) {
  return response.data;
}
