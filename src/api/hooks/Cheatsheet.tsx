import { useCallback } from 'react';
import { Study } from 'types/Enums';
import API from 'api/api';

export const useCheatsheet = () => {
  const getCheatsheets = useCallback((study: Study, grade: number, filters = null) => API.getCheatsheets(study, grade, filters), []);
  return { getCheatsheets };
};
