import { zodResolver } from '@hookform/resolvers/zod';
import { uploadFormImage } from '~/api/upload';
import FormInput, { FormInputBase } from '~/components/inputs/Input';
import FormTextarea from '~/components/inputs/Textarea';
import { FileObjectSchema, ImageUpload } from '~/components/inputs/Upload';
import { Button } from '~/components/ui/button';
import { Form, FormField } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useCreateGallery } from '~/hooks/Gallery';
import { Gallery, GalleryCreate } from '~/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string({ required_error: 'Feltet er påkrevd' }).min(1, { message: 'Gi galleriet en tittel' }),
  description: z.string().optional(),
  image: z.array(FileObjectSchema).max(1, { message: 'Du kan kun laste opp ett bilde' }),
  image_alt: z.string().optional(),
});

const CreateGallery = () => {
  const createGallery = useCreateGallery();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image: [],
      image_alt: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const image = values.image[0];
    setIsSubmitting(true);

    const image_url = (await uploadFormImage(image)) ?? '';

    const data: Partial<Gallery> = {
      title: values.title,
      description: values.description,
      image: image_url,
      image_alt: values.image_alt,
      slug: '_',
    };

    createGallery.mutate(data as GalleryCreate, {
      onSuccess: (data) => {
        toast.success('Galleriet ble lagt til');
        navigate(`/galleri/${data.id}`);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
      onSettled: () => setIsSubmitting(false),
    });
  };

  const OpenButton = (
    <Button value='outline'>
      <Plus className='w-5 h-5 mr-2' />
      Nytt galleri
    </Button>
  );

  return (
    <ResponsiveDialog description='Opprett et nytt galleri' title='Nytt galleri' trigger={OpenButton}>
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

            <Button className='w-full' disabled={isSubmitting || createGallery.isLoading} type='submit'>
              Opprett galleri
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default CreateGallery;
