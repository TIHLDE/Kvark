import { Warning } from 'types';

import { IFetch } from 'api/fetch';

import { WARNINGS_ENDPOINT } from './api';

export const WARNINGS__API = {
  getWarnings: () => IFetch<Array<Warning>>({ method: 'GET', url: `${WARNINGS_ENDPOINT}/` }),
};
