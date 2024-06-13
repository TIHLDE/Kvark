import { cn } from 'lib/utils';
import { useEffect } from 'react';

type PageProps = {
  children: React.ReactNode;
  className?: string;
};

const Page = ({ children, className }: PageProps) => {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return <div className={cn('w-full py-32 px-4 md:px-12', className)}>{children}</div>;
};

export default Page;
