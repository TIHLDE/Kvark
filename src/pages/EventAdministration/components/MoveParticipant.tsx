import { toast } from 'sonner';

import { useUpdateEventRegistration } from 'hooks/Event';

import { Button } from 'components/ui/button';
import ResponsiveAlertDialog from 'components/ui/responsive-alert-dialog';

type MoveParticipantProps = {
  eventId: number;
  isOnWait: boolean;
  checkedState: boolean;
  userId?: string;
};

const MoveParticipant = ({ eventId, userId, isOnWait, checkedState }: MoveParticipantProps) => {
  const updateRegistration = useUpdateEventRegistration(eventId);

  const moveHandler = () => {
    if (!userId) {
      return;
    }

    if (checkedState) {
      return toast.error('Du kan ikke flytte en deltaker som har ankommet.');
    }

    updateRegistration.mutate(
      { registration: { is_on_wait: !isOnWait }, userId },
      {
        onSuccess: () => {
          toast.success(`Deltakeren ble flyttet ${isOnWait ? 'til venteliste' : 'fra venteliste'}`);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  };

  const OpenButton = (
    <Button className='w-full' disabled={!userId || checkedState} variant='outline'>
      {checkedState ? 'Deltakeren har ankommet' : !userId ? 'Arrangementet er fullt' : isOnWait ? 'Flytt fra venteliste' : 'Flytt til venteliste'}
    </Button>
  );

  return (
    <ResponsiveAlertDialog
      action={moveHandler}
      description={isOnWait ? 'Flytt deltakeren fra venteliste til påmeldt' : 'Flytt deltakeren fra påmeldt til venteliste'}
      title={isOnWait ? 'Flytt fra venteliste' : 'Flytt til venteliste'}
      trigger={OpenButton}
    />
  );
};

export default MoveParticipant;

