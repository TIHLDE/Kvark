import { useState } from 'react';
import constate from 'constate';

const useMisc = () => {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  return { redirectUrl, setRedirectUrl };
};

export const [MiscProvider, useSetRedirectUrl, useRedirectUrl] = constate(
  useMisc,
  (value) => value.setRedirectUrl,
  (value) => value.redirectUrl,
);
