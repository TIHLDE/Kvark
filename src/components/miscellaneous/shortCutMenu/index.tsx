import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { PermissionApp } from 'types/Enums';

import { useHavePermission, useIsAuthenticated } from 'hooks/User';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { ScrollArea } from 'components/ui/scroll-area';
import { Separator } from 'components/ui/separator';

import ShortCutAdmin from './Admin';
import ShortCutLogout from './Logout';
import ShortCutMembership from './Membership';
import ShortCutNavigation, { ShortCutExternalNavigation } from './Navigation';
import generateHotKeys from './shortcuts';
import ShortCutFineTab from './tabs/Fine';
import ShortCutTools from './Tools';

export type ShortCutMenuProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setTab: Dispatch<SetStateAction<string>>;
};

const ShortCutMenu = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<string>('Menu');

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

    // Attach the event listener to the document
    document.addEventListener('keydown', (event: KeyboardEvent) => generateHotKeys(event, setOpen, isOpen));

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', (event: KeyboardEvent) => generateHotKeys(event, setOpen, isOpen));
    };
  }, [isOpen, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog onOpenChange={setOpen} open={isOpen}>
      <DialogContent>
        {tab === 'Menu' && (
          <>
            <DialogHeader>
              <DialogTitle>Hurtigtaster</DialogTitle>
              <DialogDescription>Et utvalg av hurtigtaster for å navigere på TIHLDE siden.</DialogDescription>
            </DialogHeader>
            <Separator />
            <ScrollArea className='h-[350px]'>
              <div className='space-y-4 pr-3'>
                <ShortCutMembership setOpen={setOpen} />
                {isAdmin && <ShortCutAdmin setOpen={setOpen} />}
                <ShortCutTools setOpen={setOpen} setTab={setTab} />
                <ShortCutNavigation setOpen={setOpen} />
                <ShortCutExternalNavigation setOpen={setOpen} />
                <ShortCutLogout setOpen={setOpen} />
              </div>
            </ScrollArea>
          </>
        )}

        {tab === 'Fine' && <ShortCutFineTab />}
      </DialogContent>
    </Dialog>
  );
};

export default ShortCutMenu;
