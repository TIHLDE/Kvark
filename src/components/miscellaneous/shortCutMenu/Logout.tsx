import { LogOut } from 'lucide-react';

import { useLogout } from 'hooks/User';

import { ShortCutMenuProps } from '.';

const ShortCutLogout = ({ setOpen }: Pick<ShortCutMenuProps, 'setOpen'>) => {
  const logOut = useLogout();

  return (
    <div
      className='flex items-center text-sm p-2 rounded-md hover:bg-secondary cursor-pointer'
      onClick={() => {
        logOut();
        setOpen(false);
      }}>
      <LogOut className='mr-2 w-4 h-4 stroke-[1.5px]' /> Logg ut
    </div>
  );
};

export default ShortCutLogout;
