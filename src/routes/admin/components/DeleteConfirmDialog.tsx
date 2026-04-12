import { Button } from '~/components/ui/button';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';

type DeleteConfirmDialogProps = {
  itemId: number | string | null;
  onDelete: () => Promise<void>;
  title: string;
  description: string;
  buttonLabel: string;
};

const DeleteConfirmDialog = ({ itemId, onDelete, title, description, buttonLabel }: DeleteConfirmDialogProps) => {
  if (!itemId) {
    return null;
  }

  return (
    <ResponsiveAlertDialog
      action={onDelete}
      description={description}
      title={title}
      trigger={
        <Button className='w-full md:w-40 block' type='button' variant='destructive'>
          {buttonLabel}
        </Button>
      }
    />
  );
};

export default DeleteConfirmDialog;
