import { cn } from '~/lib/utils';

type PageProps = {
  children: React.ReactNode;
  className?: string;
};

const Page = ({ children, className }: PageProps) => {
  return <div className={cn('w-full px-2 md:px-12', className)}>{children}</div>;
};

export default Page;
