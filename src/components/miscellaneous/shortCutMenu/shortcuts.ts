import URLS from '~/URLS';
import { navigateToExternalURL } from '~/utils';
import { Dispatch, SetStateAction } from 'react';

const generateHotKeys = (event: KeyboardEvent, setOpen: Dispatch<SetStateAction<boolean>>, isOpen: boolean) => {
  if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    setOpen(!isOpen);
  }

  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') {
    event.preventDefault();
    navigateToExternalURL(URLS.pythons);
  }

  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'g') {
    event.preventDefault();
    navigateToExternalURL(URLS.github);
  }

  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
    event.preventDefault();
    navigateToExternalURL(URLS.fondet);
  }

  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'q') {
    event.preventDefault();
    navigateToExternalURL(URLS.kontRes);
  }

  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'g') {
    event.preventDefault();
    navigateToExternalURL(URLS.pythonsLadies);
  }
};

export default generateHotKeys;
