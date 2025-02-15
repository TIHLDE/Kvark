import { Button } from 'components/ui/button';
import ResponsiveAlertDialog from 'components/ui/responsive-alert-dialog';

type DeleteEventProps = {
  eventId: number | null;
  deleteEvent: () => void;
  disabled?: boolean;
};

const DeleteEvent = ({ eventId, deleteEvent, disabled }: DeleteEventProps) => {
  return (
    <ResponsiveAlertDialog
      action={deleteEvent}
      description='Er du sikker på at du vil slette arrangementet? Dette kan ikke angres.'
      title='Slett arrangement?'
      trigger={
        <Button className='w-full md:w-40 block' disabled={disabled} type='button' variant='destructive'>
          Slett arrangement
        </Button>
      }
    />
  );
};

export default DeleteEvent;
