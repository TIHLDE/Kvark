import { zodResolver } from '@hookform/resolvers/zod';
import MarkdownEditor from '~/components/inputs/MarkdownEditor';
// import { FormImageUpload } from '~/components/inputs/Upload';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useDeleteWikiPage, useUpdateWikiPage } from '~/hooks/Wiki';
import type { WikiPage } from '~/types';
import URLS from '~/URLS';
import { urlEncode } from '~/utils';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import WikiPageTree from './WikiPageTree';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Tittelen kan ikke være tom' }),
  content: z.string(),
  image: z.string(),
  image_alt: z.string(),
});

type UpdateWikiPageProps = {
  page: WikiPage;
};

const UpdateWikiPage = ({ page }: UpdateWikiPageProps) => {
  const updatePage = useUpdateWikiPage(page.path);
  const deletePage = useDeleteWikiPage(page.path);

  const navigate = useNavigate();

  const parentPath = page.path.slice(0, page.path.length - page.slug.length - 1);
  const [open, setOpen] = useState<boolean>(false);
  const [treeNode, setTreeNode] = useState<string>(parentPath);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page.title || '',
      content: page.content || '',
      image: page.image || '',
      image_alt: page.image_alt || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updatePage.mutate(
      { ...page, ...values, slug: urlEncode(values.title), path: treeNode === '/' ? '' : treeNode },
      {
        onSuccess: (data) => {
          toast.success('Siden ble oppdatert');
          form.reset();
          setOpen(false);
          navigate(`${URLS.wiki}${data.path}`);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  };

  const onDelete = () => {
    deletePage.mutate(null, {
      onSuccess: (data) => {
        toast.success(data.detail);
        form.reset();
        setOpen(false);
        navigate(`${URLS.wiki}${parentPath}`);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const EditButton = (
    <Button>
      <Pencil className='w-5 h-5 stroke-[1.5px] mr-2' />
      Rediger side
    </Button>
  );

  return (
    <ResponsiveDialog description='Oppdater en side i wikien' onOpenChange={setOpen} open={open} title='Oppdater side' trigger={EditButton}>
      <ScrollArea className='h-[70vh] pr-4'>
        <Form {...form}>
          <form className='space-y-6 px-2 pb-6' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <Label>
                    Tittel <span className='text-red-300'>*</span>
                  </Label>
                  <FormControl>
                    <Input {...field} placeholder='Skriv her...' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MarkdownEditor form={form} label='Innhold' name='content' />

            {/* <FormImageUpload form={form} label='Velg bilde' name='image' /> */}

            <FormField
              control={form.control}
              name='image_alt'
              render={({ field }) => (
                <FormItem>
                  <Label>Bildetekst</Label>
                  <FormControl>
                    <Input placeholder='Skriv her...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <WikiPageTree selectedNode={treeNode} setSelectedNode={setTreeNode} />

            <Button className='w-full' disabled={updatePage.isLoading} type='submit'>
              {updatePage.isLoading ? 'Oppdaterer...' : 'Oppdater'}
            </Button>
          </form>
        </Form>

        <div className='border-t py-2 px-2'>
          <Button className='w-full' disabled={deletePage.isLoading} onClick={onDelete} variant='destructive'>
            {deletePage.isLoading ? 'Sletter...' : 'Slett'}
          </Button>
        </div>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default UpdateWikiPage;
