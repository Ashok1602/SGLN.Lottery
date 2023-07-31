export const dbName = 'serDatabase.db';

export const statusRequest = {
  Submitted: 'submitted',
  InProgress: 'inProgress',
  Closed: 'closed',
  Contested: 'contested',
  Cancelled: 'cancelled',
};

export const statusRequestFrench = {
  Submitted: 'Envoyée',
  InProgress: 'En Cours',
  Closed: 'Fermé',
  Contested: 'Contestée',
  Cancelled: 'Annulé',
};

export const trainingStatus = {
  Upcoming: 'upcoming',
  Completed: 'completed',
  All: 'all',
};

export const RegularExpressions = {
  UserNameValidation: /^[a-zA-Z0-9]+$/,
  PasswordValidation:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
};

export const DateFormats = {
  DateMonthYear: 'DD/MM/YYYY',
};

export const Screens = {
  AnnoucementsDetails: 'AnnoucementsDetails',
  DetailsRequestScreen: 'DetailsRequestScreen',
};
