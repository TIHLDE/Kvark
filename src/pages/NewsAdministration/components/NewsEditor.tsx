import { zodResolver } from '@hookform/resolvers/zod';
import MarkdownEditor from '~/components/inputs/MarkdownEditor';
import { FormImageUpload } from '~/components/inputs/Upload';
import { SingleUserSearch } from '~/components/inputs/UserSearch';
import RendererPreview from '~/components/miscellaneous/RendererPreview';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Switch } from '~/components/ui/switch';
import { useCreateNews, useDeleteNews, useNewsById, useUpdateNews } from '~/hooks/News';
import NewsRenderer from '~/pages/NewsDetails/components/NewsRenderer';
import type { News } from '~/types';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import DeleteNews from './DeleteNews';
import NewsEditorSkeleton from './NewsEditorSkeleton';

export type NewsEditorProps = {
  newsId: number | null;
  goToNews: (newNews: number | null) => void;
};

const formSchema = z.object({
  title: z.string().min(1, {
    error: 'Tittelen kan ikke være tom',
  }),
  header: z.string().min(1, {
    error: 'Header kan ikke være tom',
  }),
  body: z.string().min(1, {
    error: 'Innholdet kan ikke være tomt',
  }),
  image: z.string(),
  image_alt: z.string(),
  creator: z.object({ user_id: z.string() }).nullable(),
  emojis_allowed: z.boolean(),
});

const NewsEditor = ({ newsId, goToNews }: NewsEditorProps) => {
  const { data, isError, isLoading } = useNewsById(newsId || -1);
  const createNews = useCreateNews();
  const updateNews = useUpdateNews(newsId || -1);
  const deleteNews = useDeleteNews(newsId || -1);
  const isUpdating = useMemo(
    () => createNews.isPending || updateNews.isPending || deleteNews.isPending,
    [createNews.isPending, updateNews.isPending, deleteNews.isPending],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      header: '',
      creator: null,
      body: '',
      image: '',
      image_alt: '',
      emojis_allowed: false,
    },
  });

  const setValues = useCallback(
    (newValues: News | null) => {
      form.reset({
        title: newValues?.title || '',
        header: newValues?.header || '',
        creator: newValues?.creator || null,
        body: newValues?.body || '',
        image: newValues?.image || '',
        image_alt: newValues?.image_alt || '',
        emojis_allowed: newValues?.emojis_allowed || false,
      });
    },
    [form.reset],
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!newsId) {
      createNews.mutate(
        { ...values, creator: values.creator?.user_id || null },
        {
          onSuccess: (data) => {
            toast.success('Nyheten ble opprettet');
            goToNews(data.id);
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        },
      );
    } else {
      updateNews.mutate(
        { ...values, creator: values.creator?.user_id || null },
        {
          onSuccess: () => {
            toast.success('Nyheten ble oppdatert');
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (isError) {
      goToNews(null);
    }
  }, [isError, goToNews]);

  useEffect(() => {
    if (data) {
      setValues(data);
    } else {
      setValues(null);
    }
  }, [data, setValues]);

  const getNewsPreview = (): News | null => {
    const title = form.getValues('title');
    const header = form.getValues('header');
    const body = form.getValues('body');

    if (!title && !header && !body) {
      return null;
    }

    return {
      ...form.getValues(),
      created_at: new Date().toJSON(),
      id: 1,
      updated_at: new Date().toJSON(),
    } as News;
  };

  const remove = async () => {
    deleteNews.mutate(null, {
      onSuccess: (data) => {
        toast.success(data.detail);
        goToNews(null);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  if (isLoading) {
    return <NewsEditorSkeleton />;
  }

  return (
    <Card>
      <CardContent className='py-6'>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='w-full'>
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

            <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
              <FormField
                control={form.control}
                name='header'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>
                      Header <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SingleUserSearch className='w-[800px]' form={form} label='Forfatter' name='creator' />
            </div>

            <MarkdownEditor form={form} label='Innhold' name='body' required />

            <FormImageUpload form={form} label='Velg bilde' name='image' ratio='21:9' />

            <FormField
              control={form.control}
              name='image_alt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternativ bildetekst</FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='emojis_allowed'
              render={({ field }) => (
                <FormItem className='space-x-16 md:space-x-0 flex flex-row items-center justify-between rounded-md border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Reaksjoner</FormLabel>
                    <FormDescription>La brukere reagere på nyheten med emojis</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='space-y-2 md:flex md:items-center md:justify-end md:space-x-4 md:space-y-0 pt-6'>
              <DeleteNews deleteNews={remove} newsId={newsId} />

              <RendererPreview getContent={getNewsPreview} renderer={NewsRenderer} />
              <Button className='w-full md:w-40 block' disabled={isUpdating} type='submit'>
                {newsId ? 'Oppdater nyhet' : 'Opprett nyhet'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewsEditor;
