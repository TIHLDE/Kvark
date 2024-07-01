import useMediaQuery, { MEDIUM_SCREEN } from "hooks/MediaQuery"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { cn } from "lib/utils";


type ResponsiveDialogProps = {
    trigger: React.ReactNode;
    children: React.ReactNode;
    title?: string;
    description?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
};

const ResponsiveDialog = ({
    trigger,
    children,
    title,
    description,
    open,
    onOpenChange,
    className
}: ResponsiveDialogProps) => {
  const [defaultOpen, setDefaultOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  if (isDesktop) {
    return (
      <Dialog
        open={open || defaultOpen}
        onOpenChange={onOpenChange || setDefaultOpen}
      >
        <DialogTrigger asChild>
            { trigger }
        </DialogTrigger>
        <DialogContent className={cn('w-full max-w-4xl', className)}>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
          
          { children }
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open || defaultOpen}
      onOpenChange={onOpenChange || setDefaultOpen}
    >
      <DrawerTrigger asChild>
        { trigger }
      </DrawerTrigger>
      <DrawerContent className='pb-6 pl-4'>
        <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        { children }
      </DrawerContent>
    </Drawer>
  );
};


export default ResponsiveDialog;