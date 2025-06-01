import { zodResolver } from '@hookform/resolvers/zod';
import MarkdownEditor from '~/components/inputs/MarkdownEditor';
import { FormImageUpload } from '~/components/inputs/Upload';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useCreateWikiPage } from '~/hooks/Wiki';
import { WikiPage } from '~/types';
import URLS from '~/URLS';
import { urlEncode } from '~/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Tittelen kan ikke være tom' }),
  content: z.string(),
  image: z.string(),
  image_alt: z.string(),
});

type CreateWikiPageProps = {
  page: WikiPage;
};

const CreateWikiPage = ({ page }: CreateWikiPageProps) => {
  const createPage = useCreateWikiPage();

  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      image: '',
      image_alt: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPage.mutate(
      { ...values, slug: urlEncode(values.title), path: page.path },
      {
        onSuccess: (values) => {
          toast.success('Siden ble opprettet');
          form.reset();
          navigate(`${URLS.wiki}${values.path}`);
          setOpen(false);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  };

  const EditButton = (
    <Button>
      <Plus className='w-5 h-5 stroke-[1.5px] mr-2' />
      Opprett ny side
    </Button>
  );

  return (
    <ResponsiveDialog description='Opprett en ny side i wikien' onOpenChange={setOpen} open={open} title='Opprett ny side' trigger={EditButton}>
      <ScrollArea className='h-[70vh] pr-4 py-6'>
        <Form {...form}>
          <form className='space-y-6 px-2' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tittel <span className='text-red-300'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MarkdownEditor form={form} label='Innhold' name='content' />

            <FormImageUpload form={form} label='Velg bilde' name='image' />

            <FormField
              control={form.control}
              name='image_alt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bildetekst</FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='w-full' disabled={createPage.isPending} type='submit'>
              {createPage.isPending ? 'Oppretter...' : 'Opprett'}
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default CreateWikiPage;
