import { DialogDescription, DialogHeader, DialogTitle } from "components/ui/dialog";
import { ScrollArea } from "components/ui/scroll-area";
import { Separator } from "components/ui/separator";
import ShortCutFineForm from "../forms/fine";


const ShortCutFineTab = () => {
    return (
        <>
          <DialogHeader>
            <DialogTitle>Opprett bot</DialogTitle>
            <DialogDescription>Opprett en ny bot i en av dine grupper</DialogDescription>
          </DialogHeader>
          <Separator />
          <ScrollArea className='h-[350px]'>
            <ShortCutFineForm />
          </ScrollArea>
        </>
    );
};


export default ShortCutFineTab;