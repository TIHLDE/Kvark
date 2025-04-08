import { LogOut } from 'lucide-react';
import { removeCookie } from '~/api/cookie';
import { ACCESS_TOKEN } from '~/constant';

import { Button } from '~/components/ui/button';
import type { ShortCutMenuProps } from '.';
import { useRevalidator } from 'react-router';

const ShortCutLogout = ({ setOpen }: Pick<ShortCutMenuProps, 'setOpen'>) => {
  const { revalidate } = useRevalidator();
  return (
    <Button
      variant='ghost'
      autoFocus={false}
      className='flex justify-start w-full items-center text-sm p-2 rounded-md hover:bg-secondary cursor-pointer'
      onClick={() => {
        removeCookie(ACCESS_TOKEN);
        revalidate();
        // Submit to rerun the actions
        setOpen(false);
      }}
    >
      <LogOut className='mr-2 w-4 h-4 stroke-[1.5px]' /> Logg ut
    </Button>
  );
};

export default ShortCutLogout;
