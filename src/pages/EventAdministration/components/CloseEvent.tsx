import { Button } from '~/components/ui/button';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';

type CloseEventProps = {
  eventId: number | null;
  closeEvent: () => void;
};

const CloseEvent = ({ eventId, closeEvent }: CloseEventProps) => {
  if (!eventId) {
    return null;
  }

  return (
    <ResponsiveAlertDialog
      action={closeEvent}
      description='Er du sikker på at du vil stenge arrangementet? Dette kan ikke angres. Eventuell på- og avmelding vil bli stengt.'
      title='Steng arrangement?'
      trigger={
        <Button className='w-full md:w-40 block' type='button' variant='secondary'>
          Steng arrangement
        </Button>
      }
    />
  );
};

export default CloseEvent;
