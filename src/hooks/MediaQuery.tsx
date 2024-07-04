import { useEffect, useState } from 'react';

export const SMALL_SCREEN = '(min-width: 640px)';
export const MEDIUM_SCREEN = '(min-width: 768px)';
export const LARGE_SCREEN = '(min-width: 1024px)';
export const XL_SCREEN = '(min-width: 1280px)';
export const XXL_SCREEN = '(min-width: 1536px)';

const useMediaQuery = (query: string) => {
  const [value, setValue] = useState<boolean>(false);

  const onChange = (event: MediaQueryListEvent) => {
    setValue(event.matches);
  };

  useEffect(() => {
    const result = matchMedia(query);
    result.addEventListener('change', onChange);

    setValue(result.matches);

    return () => result.removeEventListener('change', onChange);
  }, [query]);

  return value;
};

export default useMediaQuery;
