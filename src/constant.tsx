export const TIHLDE_API = {
  URL: process.env.REACT_APP_API_URL || '/api/v1/',
};

export const TOKEN_HEADER_NAME = 'X-CSRF-Token';
export const ACCESS_TOKEN = 'TIHLDE-AccessToken';
export const ACCEPTED_ANALYTICS = 'TIHLDE-AcceptedAnalytics';
export const WARNINGS_READ = 'TIHLDE-WarningsRead';
export const SELECTED_THEME = 'TIHLDE-SelectedTheme';
export const EMAIL_REGEX = RegExp(
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);
