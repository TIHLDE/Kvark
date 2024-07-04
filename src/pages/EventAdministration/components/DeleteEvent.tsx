import { Button } from 'components/ui/button';
import ResponsiveAlertDialog from 'components/ui/responsive-alert-dialog';

type DeleteEventProps = {
  eventId: number | null;
  deleteEvent: () => void;
};

const DeleteEvent = ({ eventId, deleteEvent }: DeleteEventProps) => {
  if (!eventId) {
    return null;
  }

  return (
    <ResponsiveAlertDialog
      action={deleteEvent}
      description='Er du sikker på at du vil slette arrangementet? Dette kan ikke angres.'
      title='Slett arrangement?'
      trigger={
        <Button className='w-full md:w-40 block' type='button' variant='destructive'>
          Slett arrangement
        </Button>
      }
    />
  );
};

export default DeleteEvent;
