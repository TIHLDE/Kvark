import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useCreateGallery } from '~/hooks/Gallery';
import { Plus } from 'lucide-react';
import { href, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string({ required_error: 'Feltet er påkrevd' }).min(1, { message: 'Gi galleriet en tittel' }),
  description: z.string(),
  image: z.string(),
  image_alt: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateGallery = () => {
  const createGallery = useCreateGallery();
  const navigate = useNavigate();

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      async onSubmitAsync({ value }) {
        await createGallery.mutateAsync(
          {
            ...value,
            slug: '_',
          },
          {
            onSuccess: (data) => {
              toast.success('Galleriet ble lagt til');
              navigate(
                href('/galleri/:id', {
                  id: data.id,
                }),
              );
            },
            onError: (e) => {
              toast.error(e.detail);
            },
          },
        );
      },
    },
    defaultValues: {
      title: '',
      description: '',
      image: '',
      image_alt: '',
    } as FormValues,
  });

  return (
    <ResponsiveDialog
      description='Opprett et nytt galleri'
      title='Nytt galleri'
      trigger={
        <Button value='outline'>
          <Plus className='w-5 h-5 mr-2' />
          Nytt galleri
        </Button>
      }>
      <ScrollArea className='h-[60vh]'>
        <form className='space-y-6 pl-2 pb-6' onSubmit={handleFormSubmit(form)}>
          <form.AppField name='title'>{(field) => <field.InputField label='Tittel' required />}</form.AppField>

          <form.AppField name='description'>{(field) => <field.TextareaField label='Beskrivelse' />}</form.AppField>

          <form.AppField name='image'>{(field) => <field.ImageUploadField label='Cover-bilde' />}</form.AppField>

          <form.AppField name='image_alt'>{(field) => <field.InputField label='Bildetekst' />}</form.AppField>

          <form.AppForm>
            <form.SubmitButton className='w-full' disabled={createGallery.isPending} type='submit'>
              Opprett galleri
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default CreateGallery;
