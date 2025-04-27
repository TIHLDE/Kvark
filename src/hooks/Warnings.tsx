import { useQuery } from '@tanstack/react-query';
import API from '~/api/api';
import { getCookie, setCookie } from '~/api/cookie';
import { WARNINGS_READ } from '~/constant';
import { useCallback, useMemo, useState } from 'react';

export const WARNINGS_QUERY_KEY = 'warnings';

const getReadWarnings = () => {
  const warningsRead = getCookie(WARNINGS_READ);
  return (warningsRead === undefined ? [] : warningsRead) as number[];
};

export const useWarnings = () => {
  const { data, ...result } = useQuery({
    queryKey: [WARNINGS_QUERY_KEY],
    queryFn: () => API.getWarnings(),
  });
  const [readWarnings, setReadWarnings] = useState(getReadWarnings());
  const warnings = useMemo(() => (data ? data.filter((warning) => !readWarnings.includes(warning.id)) : data), [data, readWarnings]);

  const closeWarning = useCallback(
    (warningId: number) => {
      const newReadWarnings = [...readWarnings, warningId];
      setCookie(WARNINGS_READ, JSON.stringify(newReadWarnings));
      setReadWarnings(newReadWarnings);
    },
    [setReadWarnings, readWarnings],
  );

  return { data: warnings, ...result, closeWarning };
};
