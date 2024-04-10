import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { ScrollArea } from 'components/ui/scroll-area';
import { Separator } from 'components/ui/separator';

import ShortCutAdmin from './Admin';
import ShortCutMembership from './Membership';
import ShortCutNavigation, { ShortCutExternalNavigation } from './Navigation';
import generateHotKeys from './shortcuts';
import ShortCutTools from './Tools';

export type ShortCutMenuProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ShortCutMenu = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  useEffect(() => {
    // Attach the event listener to the document
    document.addEventListener('keydown', (event: KeyboardEvent) => generateHotKeys(event, setOpen, isOpen));

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', (event: KeyboardEvent) => generateHotKeys(event, setOpen, isOpen));
    };
  }, [isOpen]);

  return (
    <Dialog onOpenChange={setOpen} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hurtigtaster</DialogTitle>
          <DialogDescription>Et utvalg av hurtigtaster for å navigere på TIHLDE siden.</DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className='h-[350px]'>
          <div className='space-y-4'>
            <ShortCutMembership setOpen={setOpen} />
            <Separator />
            <ShortCutAdmin setOpen={setOpen} />
            <Separator />
            <ShortCutTools setOpen={setOpen} />
            <Separator />
            <ShortCutNavigation setOpen={setOpen} />
            <Separator />
            <ShortCutExternalNavigation setOpen={setOpen} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ShortCutMenu;
