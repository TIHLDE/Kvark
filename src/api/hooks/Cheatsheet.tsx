import { useCallback } from 'react';
import { CheatsheetGrade, CheatsheetStudy } from 'types/Enums';
import API from 'api/api';

export const useCheatsheet = () => {
  const getCheatsheets = useCallback(async (study: CheatsheetStudy, grade: CheatsheetGrade, filters = null) => {
    return API.getCheatsheets(study, grade, filters).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  return { getCheatsheets };
};
