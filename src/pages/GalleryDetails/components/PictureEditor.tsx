import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '~/components/inputs/Input';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useDeletePicture, usePictureById, useUpdatePicture } from '~/hooks/Gallery';
import type { Gallery, Picture } from '~/types';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export type PictureEditorDialogProps = {
  pictureId: Picture['id'];
  galleryId: Gallery['id'];
  onClose: () => void;
};

const formSchema = z.object({
  title: z.string().max(100, { message: 'Tittelen kan ikke være lengre enn 100 tegn' }).optional(),
  description: z.string().optional(),
  image_alt: z.string().optional(),
});

const PictureEditorDialog = ({ galleryId, pictureId, onClose }: PictureEditorDialogProps) => {
  const { data } = usePictureById(galleryId, pictureId);
  const editPicture = useUpdatePicture(galleryId, pictureId);
  const deletePicture = useDeletePicture(galleryId, pictureId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || '',
      description: data?.description || '',
      image_alt: data?.image_alt || '',
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

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    editPicture.mutate(
      {
        ...values,
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

  const OpenButton = (
    <Button className='w-full'>
      <Pencil className='mr-2 w-5 h-5' />
      Rediger bilde
    </Button>
  );

  return (
    <ResponsiveDialog description='Endre tittel, beskrivelse og bildetekst.' title='Rediger bilde' trigger={OpenButton}>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput form={form} label='Tittel' name='title' />

          <FormInput form={form} label='Beskrivelse' name='description' />

          <FormInput form={form} label='Bildetekst' name='image_alt' />

          <Button className='w-full' type='submit'>
            {editPicture.isLoading ? 'Oppdaterer bilde...' : 'Oppdater bilde'}
          </Button>

          <Button className='w-full' onClick={remove} type='button' variant='destructive'>
            {deletePicture.isLoading ? 'Sletter bilde...' : 'Slett bilde'}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default PictureEditorDialog;
