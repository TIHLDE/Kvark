import { Button } from '~/components/ui/button';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { useDeleteGroupFine } from '~/hooks/Group';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

type DeleteFineProps = {
  groupSlug: string;
  fineId: string;
};

const DeleteFine = ({ groupSlug, fineId }: DeleteFineProps) => {
  const deleteFine = useDeleteGroupFine(groupSlug, fineId);

  const onDelete = () => {
    deleteFine.mutate(undefined, {
      onSuccess: () => {
        toast.success('Boten ble slettet');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      <Trash className='mr-2 w-5 h-5' />
      Slett bot
    </Button>
  );

  return <ResponsiveAlertDialog action={onDelete} description='Er du sikker på at du vil slette denne boten?' title='Slett bot' trigger={OpenButton} />;
};

export default DeleteFine;
