import type { ReactNode } from 'react';

type MenuItemProps = {
  title: string;
  children?: ReactNode;
};

const ShortCutSectionWrapper = ({ title, children }: MenuItemProps) => {
  return (
    <div>
      <h1 className='text-muted-foreground pb-2 text-sm'>{title}</h1>
      <div className='space-y-1'>{children}</div>
    </div>
  );
};

export default ShortCutSectionWrapper;
