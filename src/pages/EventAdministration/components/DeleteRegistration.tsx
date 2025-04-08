import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { useDeleteEventRegistration } from '~/hooks/Event';
import type { UserList } from '~/types';

type DeleteRegistrationProps = {
  userInfo: UserList;
  eventId: number;
};

const DeleteRegistration = ({ userInfo, eventId }: DeleteRegistrationProps) => {
  const deleteRegistration = useDeleteEventRegistration(eventId);

  const deleteHandler = () => {
    deleteRegistration.mutate(userInfo.user_id, {
      onSuccess: () => {
        toast.success('Deltageren ble fjernet');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  return (
    <ResponsiveAlertDialog
      action={deleteHandler}
      description={`Er du sikker på at du vil fjerne ${userInfo.first_name} ${userInfo.last_name} fra arrangementet?`}
      title='Fjern deltaker'
      trigger={
        <Button className='w-full' variant='destructive'>
          Fjern deltaker
        </Button>
      }
    />
  );
};

export default DeleteRegistration;
