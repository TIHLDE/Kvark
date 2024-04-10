import { Dispatch, SetStateAction } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { Separator } from 'components/ui/separator';

import ShortCutNavigation from './Navigation';

export type ShortCutMenuProps = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ShortCutMenu = ({ isOpen, setOpen }: ShortCutMenuProps) => {
  return (
    <Dialog onOpenChange={setOpen} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hurtigtaster</DialogTitle>
          <DialogDescription>Et utvalg av hurtigtaster for å navigere på TIHLDE siden.</DialogDescription>
        </DialogHeader>
        <Separator />
        <div>
          <ShortCutNavigation setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortCutMenu;
