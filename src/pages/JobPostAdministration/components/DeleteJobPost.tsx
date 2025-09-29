import { Button } from '~/components/ui/button';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';

type DeleteJobPost = {
  jobPostId: number | null;
  deleteJobPost: () => Promise<void>;
};

const DeleteJobPost = ({ jobPostId, deleteJobPost }: DeleteJobPost) => {
  if (!jobPostId) {
    return null;
  }

  const handleDelete = async () => {
    await deleteJobPost();
  };

  return (
    <ResponsiveAlertDialog
      action={handleDelete}
      description='Er du sikker på at du vil slette annonsen? Dette kan ikke angres.'
      title='Slett annonse?'
      trigger={
        <Button className='w-full md:w-40 block' type='button' variant='destructive'>
          Slett annonse
        </Button>
      }
    />
  );
};

export default DeleteJobPost;
