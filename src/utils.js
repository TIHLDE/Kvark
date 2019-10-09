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
    return (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)) === null;
};

// Short down string if needed
export const shortDownString = (string, charsToShortDown) => {
  if (string.length > charsToShortDown) {
    string = string.slice(0, charsToShortDown) + '...';
  }
  return string;
};
