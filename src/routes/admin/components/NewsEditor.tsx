import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import MarkdownEditor from '~/components/inputs/MarkdownEditor';
import { FormImageUpload } from '~/components/inputs/Upload';
import RendererPreview from '~/components/miscellaneous/RendererPreview';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Switch } from '~/components/ui/switch';
import { Skeleton } from '~/components/ui/skeleton';
import {
  getNewsByIdQuery,
  createNewsMutation,
  updateNewsMutation,
  deleteNewsMutation,
} from '~/api/queries/news';
import NewsRenderer from '~/routes/news/components/NewsRenderer';
import type { NewsArticle } from '@tihlde/sdk';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import DeleteNews from './DeleteNews';

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
  imageUrl: z.string(),
  imageAlt: z.string(),
  emojisAllowed: z.boolean(),
});

const NewsEditor = ({ newsId, goToNews }: NewsEditorProps) => {
  const { data, isError, isLoading } = useQuery({
    ...getNewsByIdQuery(String(newsId ?? -1)),
    enabled: newsId != null && newsId > 0,
  });
  const createNews = useMutation(createNewsMutation);
  const updateNews = useMutation(updateNewsMutation);
  const deleteNews = useMutation(deleteNewsMutation);
  const isUpdating = createNews.isPending || updateNews.isPending || deleteNews.isPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      header: '',
      body: '',
      imageUrl: '',
      imageAlt: '',
      emojisAllowed: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!newsId) {
      createNews.mutate(
        { data: values },
        {
          onSuccess: (data) => {
            toast.success('Nyheten ble opprettet');
            goToNews(Number(data.id));
          },
          onError: (e: any) => {
            toast.error(e.detail ?? e.message);
          },
        },
      );
    } else {
      updateNews.mutate(
        { newsId: String(newsId), data: values },
        {
          onSuccess: () => {
            toast.success('Nyheten ble oppdatert');
          },
          onError: (e: any) => {
            toast.error(e.detail ?? e.message);
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
      form.reset({
        title: data.title || '',
        header: data.header || '',
        body: data.body || '',
        imageUrl: data.imageUrl || '',
        imageAlt: data.imageAlt || '',
        emojisAllowed: data.emojisAllowed || false,
      });
    } else if (!newsId) {
      form.reset({
        title: '',
        header: '',
        body: '',
        imageUrl: '',
        imageAlt: '',
        emojisAllowed: false,
      });
    }
  }, [data, newsId, form.reset]);

  const getNewsPreview = (): NewsArticle | null => {
    const title = form.getValues('title');
    const header = form.getValues('header');
    const body = form.getValues('body');

    if (!title && !header && !body) {
      return null;
    }

    return {
      id: '1',
      title,
      header,
      body,
      imageUrl: form.getValues('imageUrl') || null,
      imageAlt: form.getValues('imageAlt') || null,
      emojisAllowed: form.getValues('emojisAllowed'),
      createdById: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: null,
      reactions: [],
    };
  };

  const remove = async () => {
    if (!newsId) return;
    deleteNews.mutate(
      { newsId: String(newsId) },
      {
        onSuccess: () => {
          toast.success('Nyheten ble slettet');
          goToNews(null);
        },
        onError: (e: any) => {
          toast.error(e.detail ?? e.message);
        },
      },
    );
  };

  if (isLoading && newsId) {
    return <Skeleton className='w-full h-[60vh]' />;
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

            <MarkdownEditor form={form} label='Innhold' name='body' required />

            <FormImageUpload form={form} label='Velg bilde' name='imageUrl' ratio='21:9' />

            <FormField
              control={form.control}
              name='imageAlt'
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
              name='emojisAllowed'
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
