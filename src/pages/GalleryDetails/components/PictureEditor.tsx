import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useDeletePicture, usePictureById, useUpdatePicture } from '~/hooks/Gallery';
import type { Gallery, Picture } from '~/types';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

export type PictureEditorDialogProps = {
  pictureId: Picture['id'];
  galleryId: Gallery['id'];
  onClose: () => void;
};

const formSchema = z.object({
  title: z.string().max(100, { message: 'Tittelen kan ikke være lengre enn 100 tegn' }),
  description: z.string(),
  image_alt: z.string(),
});

function PictureEditForm({ data, galleryId, onClose }: { data: Picture; galleryId: string; onClose: () => void }) {
  const pictureId = data.id;
  const editPicture = useUpdatePicture(galleryId, pictureId);
  const deletePicture = useDeletePicture(galleryId, pictureId);

  const form = useAppForm({
    validators: { onBlur: formSchema },
    defaultValues: { title: data.title, description: data.description, image_alt: data.image_alt },
    onSubmit({ value }: { value: z.infer<typeof formSchema> }) {
      editPicture.mutate(
        {
          ...value,
          image: data?.image || '',
        },
        {
          onSuccess: () => {
            toast.success('Bildet ble oppdatert');
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        },
      );
    },
  });

  const remove = () =>
    deletePicture.mutate(null, {
      onSuccess: () => {
        toast.success('Bildet ble slettet');
        onClose();
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  return (
    <form className='space-y-4' onSubmit={handleFormSubmit(form)}>
      <form.AppField name='title'>{(field) => <field.InputField label='Tittel' />}</form.AppField>

      <form.AppField name='description'>{(field) => <field.InputField label='Beskrivelse' />}</form.AppField>

      <form.AppField name='image_alt'>{(field) => <field.InputField label='Bildetekst' />}</form.AppField>

      <form.AppForm>
        <form.SubmitButton className='w-full' type='submit'>
          {editPicture.isPending ? 'Oppdaterer bilde...' : 'Oppdater bilde'}
        </form.SubmitButton>
      </form.AppForm>

      <Button className='w-full' onClick={remove} type='button' variant='destructive'>
        {deletePicture.isPending ? 'Sletter bilde...' : 'Slett bilde'}
      </Button>
    </form>
  );
}

const PictureEditorDialog = ({ galleryId, pictureId, onClose }: PictureEditorDialogProps) => {
  const { data } = usePictureById(galleryId, pictureId);

  return (
    <ResponsiveDialog
      description='Endre tittel, beskrivelse og bildetekst.'
      title='Rediger bilde'
      trigger={
        <Button className='w-full'>
          <Pencil className='mr-2 w-5 h-5' />
          Rediger bilde
        </Button>
      }>
      {data && <PictureEditForm data={data} galleryId={galleryId} onClose={onClose} />}
    </ResponsiveDialog>
  );
};

export default PictureEditorDialog;
