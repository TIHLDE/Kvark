import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { useHavePermission, useIsAuthenticated } from '~/hooks/User';
import { PermissionApp } from '~/types/Enums';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import ShortCutAdmin from './Admin';
import ShortCutLogout from './Logout';
import ShortCutMembership from './Membership';
import ShortCutNavigation, { ShortCutExternalNavigation } from './Navigation';
import generateHotKeys from './shortcuts';
import ShortCutTools from './Tools';

export type ShortCutMenuProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ShortCutMenu = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const { allowAccess: isAdmin } = useHavePermission([
    PermissionApp.EVENT,
    PermissionApp.JOBPOST,
    PermissionApp.NEWS,
    PermissionApp.USER,
    PermissionApp.STRIKE,
    PermissionApp.GROUP,
  ]);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      setOpen(false);
      return;
    }

    const abortController = new AbortController();

    // Attach the event listener to the document
    document.addEventListener('keydown', (event: KeyboardEvent) => generateHotKeys(event, setOpen, isOpen), { signal: abortController.signal });

    // Cleanup the event listener on component unmount
    return () => abortController.abort();
  }, [isOpen, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

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
            {isAdmin && (
              <>
                <ShortCutAdmin setOpen={setOpen} />
                <Separator />
              </>
            )}
            <ShortCutTools setOpen={setOpen} />
            <Separator />
            <ShortCutNavigation setOpen={setOpen} />
            <Separator />
            <ShortCutExternalNavigation setOpen={setOpen} />
            <Separator />
            <ShortCutLogout setOpen={setOpen} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ShortCutMenu;
