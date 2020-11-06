import slugify from 'slugify';
import { UserStudy, UserClass } from 'types/Enums';

export const urlEncode = (text = '') => slugify(text, { lower: true, strict: true, locale: 'nb' });

// Short down string if needed
export const shortDownString = (string: string, charsToShortDown: number) => {
  if (string.length > charsToShortDown) {
    string = string.slice(0, charsToShortDown) + '...';
  }
  return string;
};

// Get user study short
export const getUserStudyShort = (userStudy: UserStudy) => {
  switch (userStudy) {
    case UserStudy.DATAING:
      return 'Dataing';
    case UserStudy.DIGFOR:
      return 'DigFor';
    case UserStudy.DIGSEC:
      return 'DigSec';
    case UserStudy.DIGSAM:
      return 'DigSam';
    case UserStudy.DRIFT:
      return 'Drift';
    default:
      return 'Ukjent studie';
  }
};
// Get user study long
export const getUserStudyLong = (userStudy: UserStudy) => {
  switch (userStudy) {
    case UserStudy.DATAING:
      return 'Dataingeniør';
    case UserStudy.DIGFOR:
      return 'Digital forretningsutvikling';
    case UserStudy.DIGSEC:
      return 'Digital infrastruktur og cybersikkerhet';
    case UserStudy.DIGSAM:
      return 'Digital samhandling';
    case UserStudy.DRIFT:
      return 'Drift av datasystemer';
    default:
      return 'Ukjent studie';
  }
};
// Get user class
export const getUserClass = (userClass: UserClass) => {
  switch (userClass) {
    case UserClass.ALUMNI:
      return 'Alumni';
    case UserClass.FIRST:
      return '1. klasse';
    case UserClass.SECOND:
      return '2. klasse';
    case UserClass.THIRD:
      return '3. klasse';
    case UserClass.FOURTH:
      return '4. klasse';
    case UserClass.FIFTH:
      return '5. klasse';
    default:
      return 'Ukjent klasse';
  }
};

// Add leading zero to numbers below 10. Ex: 2 -> 02, 12 -> 12
const addLeadingZero = (number: number) => (number < 10 ? '0' + number : number);

export const formatDate = (date: Date) => {
  return (
    getDay(date.getDay()) +
    ' ' +
    date.getDate() +
    ' ' +
    getMonth(date.getMonth()) +
    ' - kl. ' +
    addLeadingZero(date.getHours()) +
    ':' +
    addLeadingZero(date.getMinutes())
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFormattedDate = (date: any) => {
  return getDay(date.day()) + ' ' + date.date() + ' ' + getMonth(date.month()) + ' - kl. ' + date.format('HH:mm');
};

export const getDay = (day: number) => {
  switch (day) {
    case 0:
      return 'Søndag';
    case 1:
      return 'Mandag';
    case 2:
      return 'Tirsdag';
    case 3:
      return 'Onsdag';
    case 4:
      return 'Torsdag';
    case 5:
      return 'Fredag';
    case 6:
      return 'Lørdag';
    default:
      return day;
  }
};
export const getMonth = (month: number) => {
  switch (month) {
    case 0:
      return 'jan';
    case 1:
      return 'feb';
    case 2:
      return 'mars';
    case 3:
      return 'april';
    case 4:
      return 'mai';
    case 5:
      return 'juni';
    case 6:
      return 'juli';
    case 7:
      return 'aug';
    case 8:
      return 'sep';
    case 9:
      return 'okt';
    case 10:
      return 'nov';
    case 11:
      return 'des';
    default:
      return month;
  }
};

export const getParameterByName = (paramName: string, url: string | null) => {
  if (!url) {
    return null;
  }
  paramName = paramName.replace(/[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + paramName + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
