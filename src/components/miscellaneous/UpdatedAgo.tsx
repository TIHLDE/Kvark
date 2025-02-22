import { formatDistanceToNow, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { WatchIcon } from 'lucide-react';

type UpdatedAgoProps = {
  updatedAt: string;
};

const UpdatedAgo = ({ updatedAt }: UpdatedAgoProps) => {
  const updatedTimeAgo = updatedAt ? formatDistanceToNow(parseISO(updatedAt), { locale: nb }) : null;

  if (!updatedTimeAgo) {
    return null;
  }

  return (
    <div className='flex items-center space-x-1'>
      <WatchIcon className='w-4 h-4 stroke-[1.5px] text-muted-foreground' />
      <h1 className='text-sm text-muted-foreground'>Oppdatert {updatedTimeAgo} siden</h1>
    </div>
  );
};

export default UpdatedAgo;
