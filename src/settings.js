// This class is used to store important constants
// which are reasonable to want to change.

export const TIHLDE_API = {
  URL: process.env.REACT_APP_API_URL || '/api/v1/',
};

export const TOKEN_HEADER_NAME = 'X-CSRF-Token';
export const ACCESS_TOKEN = 'access_token';
export const ACCEPTED_ANALYTICS = 'accepted_analytics';
export const WARNINGS_READ = 'warnings_read';
export const THEME = 'theme';
export const THEME_OPTIONS = { light: 'light', automatic: 'automatic', dark: 'dark' };
