import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import type { UserBio } from '~/types';

import UserBioForm from './BioEditor';

export type BioButtonProps = {
  userBio: UserBio;
};

const EditBioButton = ({ userBio }: BioButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const OpenButton = (
    <Button variant='outline'>
      <Pencil className='mr-2 w-5 h-5 stroke-[1.5px]' /> Redigér bio
    </Button>
  );

  return (
    <ResponsiveDialog description='Rediger din bio' onOpenChange={setOpen} open={open} title='Redigér bio' trigger={OpenButton}>
      <ScrollArea className='h-[60vh]'>
        <UserBioForm setOpen={setOpen} userBio={userBio} />
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default EditBioButton;
