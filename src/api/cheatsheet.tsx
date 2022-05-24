import { Cheatsheet, PaginationResponse } from 'types';
import { CheatsheetStudy } from 'types/Enums';

import { IFetch } from 'api/fetch';

import { CHEATSHEETS_ENDPOINT } from './api';

export const CHEATSHEETS_API = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCheatsheets: (study: CheatsheetStudy, grade: number, filters?: any) => {
    const tempStudy = study === CheatsheetStudy.DIGSEC ? 'DIGINC' : study;
    return IFetch<PaginationResponse<Cheatsheet>>({
      method: 'GET',
      url: `${CHEATSHEETS_ENDPOINT}/${tempStudy.toUpperCase()}/${String(grade)}/files/`,
      data: filters || {},
      withAuth: true,
    });
  },
};
