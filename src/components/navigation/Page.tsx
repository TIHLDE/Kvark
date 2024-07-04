import { cn } from 'lib/utils';

type PageProps = {
  children: React.ReactNode;
  className?: string;
};

const Page = ({ children, className }: PageProps) => {
  return <div className={cn('w-full py-20 md:py-28 px-4 md:px-12', className)}>{children}</div>;
};

export default Page;
