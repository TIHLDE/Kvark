import { ButtonProps } from '@mui/material';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

import { UserBio } from 'types';

import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from 'components/ui/dialog';

import UserBioForm from './BioEditor';

export type BioButtonProps = ButtonProps & {
  userBio: UserBio;
};

const EditBioButton = ({ userBio }: BioButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='lg' variant='outline'>
          <Pencil className='mr-2 w-5 h-5 stroke-[1.5px]' /> Redigér bio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redigér bio</DialogTitle>
          <DialogDescription>Rediger din bio</DialogDescription>
        </DialogHeader>
        <UserBioForm setOpen={setOpen} userBio={userBio} />
      </DialogContent>
    </Dialog>
  );
};

export default EditBioButton;
