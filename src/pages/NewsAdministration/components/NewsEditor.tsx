import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import RendererPreview from '~/components/miscellaneous/RendererPreview';
import { Card, CardContent } from '~/components/ui/card';
import { useCreateNews, useDeleteNews, useNewsById, useUpdateNews } from '~/hooks/News';
import NewsRenderer from '~/pages/NewsDetails/components/NewsRenderer';
import type { News } from '~/types';
import { useEffect } from 'react';
import { href, Navigate, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import DeleteNews from './DeleteNews';
import NewsEditorSkeleton from './NewsEditorSkeleton';

export type NewsEditorProps = {
  newsId: number | null;
};

const formSchema = z.object({
  title: z.string().min(1, { message: 'Tittelen kan ikke være tom' }),
  header: z.string().min(1, { message: 'Header kan ikke være tom' }),
  body: z.string().min(1, { message: 'Innholdet kan ikke være tomt' }),
  image: z.string(),
  image_alt: z.string(),
  creator: z.string().optional(),
  emojis_allowed: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewsEditor({ newsId }: NewsEditorProps) {
  const { data, isError, isLoading } = useNewsById(newsId || -1);
  const createNews = useCreateNews();
  const updateNews = useUpdateNews(newsId || -1);
  const deleteNews = useDeleteNews(newsId || -1);
  const navigate = useNavigate();

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    defaultValues: {
      title: data?.title ?? '',
      header: data?.header ?? '',
      creator: data?.creator?.user_id ?? '',
      body: data?.body ?? '',
      image: data?.image ?? '',
      image_alt: data?.image_alt ?? '',
      emojis_allowed: data?.emojis_allowed ?? false,
    } as FormValues,

    async onSubmit({ value }) {
      if (!newsId) {
        await createNews.mutateAsync(
          { ...value, creator: value.creator ?? null },
          {
            onSuccess: (data) => {
              toast.success('Nyheten ble opprettet');
              navigate(href('/nyheter/:id', { id: String(data.id) }));
            },
            onError: (e) => {
              toast.error(e.detail);
            },
          },
        );
      } else {
        await updateNews.mutateAsync(
          { ...value, creator: value.creator ?? null },
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
    },
  });

  const getNewsPreview = (): News | null => {
    const { title, header, body } = form.state.values as FormValues;

    if (!title && !header && !body) {
      return null;
    }

    return {
      ...(form.state.values as FormValues),
      creator: null,
      created_at: new Date().toJSON(),
      id: 1,
      updated_at: new Date().toJSON(),
    } as News;
  };

  const remove = async () => {
    deleteNews.mutate(null, {
      onSuccess: (data) => {
        toast.success(data.detail);
        navigate(href('/nyheter'));
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  useEffect(() => {
    form.reset();
  }, [data, form]);

  if (isLoading) {
    return <NewsEditorSkeleton />;
  }

  if (isError) {
    return <Navigate to={href('/nyheter')} />;
  }

  return (
    <Card>
      <CardContent className='py-6'>
        <form className='space-y-6' onSubmit={handleFormSubmit(form)}>
          <form.AppField name='title'>{(field) => <field.InputField label='Tittel' required />}</form.AppField>

          <div className='space-y-6 w-full md:grid md:gap-x-4 md:grid-cols-2'>
            <form.AppField name='header'>{(field) => <field.InputField label='Header' required />}</form.AppField>

            <form.AppField name='creator'>{(field) => <field.UserField label='Forfatter' multiple={false} />}</form.AppField>
          </div>

          <form.AppField name='body'>{(field) => <field.TextareaField label='Innhold' required />}</form.AppField>

          <form.AppField name='image'>{(field) => <field.ImageUploadField label='Velg bilde' />}</form.AppField>

          <form.AppField name='image_alt'>{(field) => <field.InputField label='Alternativ bilde tekst' />}</form.AppField>

          <form.AppField name='emojis_allowed'>
            {(field) => <field.SwitchField label='Reaksjoner' description='La brukere reagere på nyheten med emojis' />}
          </form.AppField>

          <div className='space-y-2 md:flex md:items-center md:justify-end md:space-x-4 md:space-y-0 pt-6'>
            <DeleteNews deleteNews={remove} newsId={newsId} />

            <RendererPreview getContent={getNewsPreview} renderer={NewsRenderer} />
            <form.AppForm>
              <form.SubmitButton className='w-full md:w-40 block' loading='Lagrer endringer...' type='submit'>
                {newsId ? 'Oppdater nyhet' : 'Opprett nyhet'}
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
