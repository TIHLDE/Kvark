import useMediaQuery, { MEDIUM_SCREEN } from "~/hooks/MediaQuery"
import { type MouseEventHandler, useState } from "react"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import { Button } from "./button";


type ResponsiveAlertDialogProps = {
    trigger: React.ReactNode;
    title?: string;
    description?: string;
    action: MouseEventHandler<HTMLButtonElement>;
    actionText?: string;
    destructive?: boolean;
};

const ResponsiveAlertDialog = ({
  trigger,
  title,
  description,
  action,
  actionText = 'Slett',
  destructive = true
}: ResponsiveAlertDialogProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            { trigger }
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogCancel>
                    Avbryt
                </AlertDialogCancel>
              <AlertDialogAction className={destructive ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : undefined} onClick={action}>
                {actionText}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        { trigger }
      </DrawerTrigger>
      <DrawerContent className='pb-6 px-4'>
        <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        
        <Button
            variant='outline'
            onClick={() => setOpen(false)}
        >
            Avbryt
        </Button>
        <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={(e) => {
              action(e);
              setOpen(false);
            }}
        >
            {actionText}
        </Button>
      </DrawerContent>
    </Drawer>
  );
};


export default ResponsiveAlertDialog;