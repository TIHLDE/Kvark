import { removeCookie } from '~/api/cookie';
import { ACCESS_TOKEN } from '~/constant';
import { LogOut } from 'lucide-react';

import { ShortCutMenuProps } from '.';

const ShortCutLogout = ({ setOpen }: Pick<ShortCutMenuProps, 'setOpen'>) => {
  return (
    <div
      className='flex items-center text-sm p-2 rounded-md hover:bg-secondary cursor-pointer'
      onClick={() => {
        removeCookie(ACCESS_TOKEN);
        // Submit to rerun the actions
        setOpen(false);
      }}>
      <LogOut className='mr-2 w-4 h-4 stroke-[1.5px]' /> Logg ut
    </div>
  );
};

export default ShortCutLogout;
