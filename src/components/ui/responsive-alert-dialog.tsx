import useMediaQuery, { MEDIUM_SCREEN } from "hooks/MediaQuery"
import { MouseEventHandler, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import { Button } from "./button";


type ResponsiveAlertDialogProps = {
    trigger: React.ReactNode;
    title?: string;
    description?: string;
    action: MouseEventHandler<HTMLButtonElement> | undefined;
};

const ResponsiveAlertDialog = ({
    trigger,
    title,
    description,
    action
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
                <AlertDialogAction onClick={action}>
                    Bekreft
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
            onClick={action}
        >
            Bekreft
        </Button>
      </DrawerContent>
    </Drawer>
  );
};


export default ResponsiveAlertDialog;