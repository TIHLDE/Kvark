import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import FormInput from '~/components/inputs/Input';
import FormTextarea from '~/components/inputs/Textarea';
import { FormImageUpload } from '~/components/inputs/Upload';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useCreateGallery } from '~/hooks/Gallery';
import { urlEncode } from '~/utils';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  title: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Feltet er påkrevd' : undefined),
    })
    .min(1, {
      error: 'Gi galleriet en tittel',
    }),
  description: z.string().optional(),
  image: z.string().optional(),
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
      image: '',
      image_alt: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      slug: '_',
    };

    createGallery.mutate(data, {
      onSuccess: (data) => {
        toast.success('Galleriet ble lagt til');
        navigate({
          to: `/galleri/$id/{-$urlTitle}`,
          params: {
            id: data.id,
            urlTitle: urlEncode(data.title),
          },
        });
      },
      onError: (e) => {
        toast.error(e.detail);
      },
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

            <FormImageUpload form={form} label='Cover-bilde' name='image' />

            <FormInput form={form} label='Bildetekst' name='image_alt' />

            <Button className='w-full' disabled={createGallery.isPending} type='submit'>
              Opprett galleri
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default CreateGallery;
