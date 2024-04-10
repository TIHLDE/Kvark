import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ShortCutMenuProps } from '.';

const ShortCutNavigation = ({ setOpen }: Pick<ShortCutMenuProps, 'setOpen'>) => {
  const links = [
    {
      title: 'Hjem',
      path: '/',
    },
    {
      title: 'Arrangementer',
      path: '/arrangementer',
    },
    {
      title: 'Nyheter',
      path: '/nyheter',
    },
    {
      title: 'Karriere',
      path: '/karriere',
    },
    {
      title: 'Wiki',
      path: '/wiki',
    },
    {
      title: 'Grupper',
      path: '/grupper',
    },
  ];

  return (
    <div>
      <h1 className=' text-muted-foreground pb-2 text-sm'>Navigering</h1>
      <div className='space-y-1'>
        {links.map((link, index) => (
          <Link className='flex items-center text-sm p-2 rounded-md hover:bg-secondary' key={index} onClick={() => setOpen(false)} to={link.path}>
            <ArrowRight className='mr-2 w-4 h-4 stroke-[1.5px]' /> {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShortCutNavigation;
