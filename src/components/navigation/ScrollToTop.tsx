import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const [lastPath, setLastPath] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (lastPath !== pathname) {
      setLastPath(pathname);
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
