import { isAfterDateOfYear, isBeforeDateOfYear } from 'utils';

/**
 * Url to backend
 */
export const TIHLDE_API_URL = import.meta.env.VITE_API_URL;
/**
 * Client ID for Feide application
 */
export const FEIDE_CLIENT_ID = import.meta.env.VITE_FEIDE_CLIENT_ID;
/**
 * Redirect URI for Feide application
 */
export const FEIDE_REDIRECT_URI = import.meta.env.VITE_FEIDE_REDIRECT_URI;
/**
 * Authn state for Feide application
 */
export const FEIDE_AUTH_STATE = import.meta.env.VITE_FEIDE_AUTH_STATE;
/**
 * Feide Auth Url
 */
export const FEIDE_AUTH_URL = 'https://auth.dataporten.no/oauth/authorization';
/**
 * Name of auth-token which is sent to backend to authenticate the user
 */
export const TOKEN_HEADER_NAME = 'X-CSRF-Token';
/**
 * Name of cookie which is used to store the authentication-token from backend
 */
export const ACCESS_TOKEN = 'TIHLDE-AccessToken';
/**
 * Name of cookie which is used to store whether the user has accepted our analytics popup
 */
export const ACCEPTED_ANALYTICS = 'TIHLDE-AcceptedAnalytics';
/**
 * Name of cookie which is used to store which warnings that have been read by the user
 */
export const WARNINGS_READ = 'TIHLDE-WarningsRead';
/**
 * Name of cookie which is used to store which theme is selected by the user
 */
export const SELECTED_THEME = 'TIHLDE-SelectedTheme';
/**
 * Regex used to check that a given email is a valid email
 */
export const EMAIL_REGEX = RegExp(
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

/**
 * The results from Samordna Opptak is usually given at July 20th each year
 */
const IS_AFTER_APRIL_1ST = isAfterDateOfYear(3, 1);
/**
 * Fadderuka is usually finished by September 5th
 */
const IS_BEFORE_SEPTEMBER_5TH = isBeforeDateOfYear(8, 5);
/**
 * Whether the new student-page and its belonging info-box at the landing-page should be shown or not
 */
export const SHOW_NEW_STUDENT_INFO = IS_AFTER_APRIL_1ST && IS_BEFORE_SEPTEMBER_5TH;

export const SHOW_FADDERUKA_INFO = isAfterDateOfYear(6, 20) && isBeforeDateOfYear(8, 1);
