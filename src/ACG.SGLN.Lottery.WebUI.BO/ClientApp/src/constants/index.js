import i18n from 'i18next';

export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
export const TRANSLATE = i18n;
export const INDEX_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];
export const MAX_FILE_SIZE = 10485760; //10mb in bytes
export const ACCEPTED_FILES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/bmp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

//const for email regular expression
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASSWORD_REGEX =
  /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=<>-]).*$/;
export const USER_PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[!@#$%^&*<>-])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

export const NOTIFITION_DD_ACCEPTED_FILES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

//for incentive Reports
export const GamesList = ['Loto', 'Joker', 'Keno', 'Quatro'];
