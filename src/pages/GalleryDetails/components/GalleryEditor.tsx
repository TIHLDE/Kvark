import { zodResolver } from '@hookform/resolvers/zod';
import API from '~/api/api';
import FormInput, { FormInputBase } from '~/components/inputs/Input';
import FormTextarea from '~/components/inputs/Textarea';
import { FileObjectSchema, ImageUpload } from '~/components/inputs/Upload';
import { Button } from '~/components/ui/button';
import { Form, FormField } from '~/components/ui/form';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useDeleteGallery, useGalleryById, useUpdateGallery } from '~/hooks/Gallery';
import type { Gallery, GalleryRequired } from '~/types';
import URLS from '~/URLS';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

export type GalleryEditorProps = {
  id: Gallery['id'];
};

const formSchema = z.object({
  title: z.string({ required_error: 'Feltet er påkrevd' }).min(1, { message: 'Gi galleriet en tittel' }),
  description: z.string().optional(),
  image: z.array(FileObjectSchema).max(1, { message: 'Du kan kun laste opp max ett bilde' }),
  image_alt: z.string().optional(),
});

const GalleryEditor = ({ id }: GalleryEditorProps) => {
  const { data } = useGalleryById(id);
  const editGallery = useUpdateGallery(id);
  const deleteGallery = useDeleteGallery(id);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || '',
      description: data?.description || '',
      image: data?.image
        ? [
            {
              id: data.image,
              file: data.image,
              name: data.image,
            },
          ]
        : [],
      image_alt: data?.image_alt || '',
    },
  });

  const remove = () =>
    deleteGallery.mutate(null, {
      onSuccess: () => {
        toast.error('Galleriet ble slettet');
        navigate(URLS.gallery);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const image = values.image[0];
    setIsSubmitting(true);

    const image_url = image
      ? await new Promise<string>((res) => {
          if (typeof image.file === 'string') {
            return res(image.file);
          }
          toast.promise(API.uploadFile(image.file as File), {
            loading: 'Laster opp bilde',
            success: ({ url }) => {
              res(url);
              return 'Bildet lastet opp';
            },
            error: () => {
              setIsSubmitting(false);
              res('');
              return 'Kunne ikke laste opp bilde';
            },
          });
        })
      : '';

    const data: Partial<Gallery> = {
      title: values.title,
      description: values.description,
      image: image_url,
      image_alt: values.image_alt,
    };
    editGallery.mutate(data as GalleryRequired, {
      onSuccess: () => {
        toast.success('Galleriet ble oppdatert');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const OpenButton = (
    <Button variant='outline'>
      <Pencil className='w-5 h-5 mr-2' />
      Rediger galleri
    </Button>
  );

  return (
    <ResponsiveDialog description='Endre tittel, beskrivelse og bilde.' title='Oppdater galleri' trigger={OpenButton}>
      <ScrollArea className='h-[60vh]'>
        <Form {...form}>
          <form className='space-y-6 pl-2 pb-6' onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput form={form} label='Tittel' name='title' required />

            <FormTextarea form={form} label='Beskrivelse' name='description' />

            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormInputBase label='Cover-bilde'>
                  <ImageUpload onChange={field.onChange} title='Last opp et cover-bilde' value={field.value} />
                </FormInputBase>
              )}
            />

            <FormInput form={form} label='Bildetekst' name='image_alt' />

            <Button className='w-full' disabled={isSubmitting || editGallery.isLoading} type='submit'>
              Oppdater galleri
            </Button>

            <ResponsiveAlertDialog
              action={remove}
              description='Er du sikker på at du vil slette galleriet?'
              title='Slett galleri'
              trigger={
                <Button className='w-full' variant='destructive'>
                  Slett galleri
                </Button>
              }
            />
          </form>
        </Form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default GalleryEditor;
