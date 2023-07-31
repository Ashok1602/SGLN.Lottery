export const GetFirstLetters = String => {
  if (String !== '') {
    return String.match(/\b(\w)/g);
  } else {
    return '';
  }
};

export const removeEmptySpaces = Number => {
  return `${Number}`.replace(/\s/g, '');
};
