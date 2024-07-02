import { Button } from 'components/ui/button';
import ResponsiveAlertDialog from 'components/ui/responsive-alert-dialog';

type DeleteNewsProps = {
  newsId: number | null;
  deleteNews: () => Promise<void>;
};

const DeleteNews = ({ newsId, deleteNews }: DeleteNewsProps) => {
  if (!newsId) {
    return null;
  }

  return (
    <ResponsiveAlertDialog
      action={deleteNews}
      description='Er du sikker på at du vil slette nyheten? Dette kan ikke angres.'
      title='Slett nyhet?'
      trigger={
        <Button className='w-full md:w-40 block' type='button' variant='destructive'>
          Slett nyhet
        </Button>
      }
    />
  );
};

export default DeleteNews;
