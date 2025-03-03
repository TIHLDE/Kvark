import { Link as LinkIcon, SquareArrowOutUpRight } from 'lucide-react';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Link } from 'react-router';

type MenuItemProps = {
  title: string;
  path: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  external?: boolean;
  hotKey?: ReactNode;
};

const ShortCutLink = ({ title, path, setOpen, external, hotKey }: MenuItemProps) => {
  return (
    <Link
      className='flex items-center justify-between text-sm p-2 rounded-md hover:bg-secondary'
      onClick={() => setOpen(false)}
      rel={external ? 'noreferrer' : ''}
      target={external ? '_blank' : ''}
      to={path}>
      <div className='flex items-center'>
        {!external ? <LinkIcon className='mr-2 w-4 h-4 stroke-[1.5px]' /> : <SquareArrowOutUpRight className='mr-2 w-4 h-4 stroke-[1.5px]' />} {title}
      </div>
      {hotKey}
    </Link>
  );
};

export default ShortCutLink;
