// Convert date-string to more readable text
export const refactorDateString = (dateString) => {
  if (!dateString || dateString.length < 10) {
    return dateString;
  } else if (!(typeof(dateString) === 'string')) {
    return dateString;
  }

  // This solutions also works for Safari
  const convertedStringDate = dateString.substring(0, 10);
  let date = new Date(convertedStringDate);
  if (!date) {
    date = new Date(convertedStringDate.replace(/-/g, '/'));
  }
  return date.toDateString();
};

// Convert date-string to more readable text
export const stringToDate = (dateString) => {
  if (!dateString || dateString.length < 10) {
    return new Date();
  } else if (!(typeof(dateString) === 'string')) {
    return new Date();
  }

  // This solutions also works for Safari
  const convertedStringDate = dateString.substring(0, 10);
  let date = new Date(convertedStringDate);
  if (!date) {
    date = new Date(convertedStringDate.replace(/-/g, '/'));
  }
  return date;
};

// Checks if browser is run on desktop
export const isDesktop = () => {
  return (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i)) === null;
};

// Short down string if needed
export const shortDownString = (string, charsToShortDown) => {
  if (string.length > charsToShortDown) {
    string = string.slice(0, charsToShortDown) + '...';
  }
  return string;
};

// Get user study short
export const getUserStudyShort = (userStudy) => {
  switch (userStudy) {
    case 1: return 'Dataing';
    case 2: return 'DigFor';
    case 3: return 'DigInc';
    case 4: return 'DigSam';
    case 5: return 'Drift';
    default: return 'Ikke oppgitt';
  }
};
// Get user study long
export const getUserStudyLong = (userStudy) => {
  switch (userStudy) {
    case 1: return 'Dataingeniør';
    case 2: return 'Digital forretningsutvikling';
    case 3: return 'Digital infrastruktur og cybersikkerhet';
    case 4: return 'Digital samhandling';
    case 5: return 'Drift av datasystemer';
    default: return 'Ikke oppgitt';
  }
};
// Get user class
export const getUserClass = (userStudy) => {
  switch (userStudy) {
    case 1: return '1. klasse';
    case 2: return '2. klasse';
    case 3: return '3. klasse';
    case 4: return '4. klasse';
    case 5: return '5. klasse';
    default: return 'Ikke oppgitt';
  }
};
