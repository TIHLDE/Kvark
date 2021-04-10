export const TIHLDE_API = {
  URL: process.env.REACT_APP_API_URL || '/api/v1/',
};

export const TOKEN_HEADER_NAME = 'X-CSRF-Token';
export const ACCESS_TOKEN = 'access_token';
export const ACCEPTED_ANALYTICS = 'accepted_analytics';
export const WARNINGS_READ = 'warnings_read';
export const EMAIL_REGEX = RegExp(
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);
