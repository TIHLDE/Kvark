import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useCreateInfoBanner, useDeleteInfoBanner, useInfoBanner, useUpdateInfoBanner } from '~/hooks/InfoBanner';
import type { InfoBanner } from '~/types';
import { formatDate } from '~/utils';
import { formatDistance, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Info, Pencil, Trash } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

type InfoBannerFormProps = {
  bannerId?: string;
};

const formSchema = z.object({
  title: z.string().min(1, { message: 'Feltet er påkrevd' }),
  description: z.string().min(1, { message: 'Feltet er påkrevd' }),
  image: z.string().optional(),
  image_alt: z.string().optional(),
  url: z.string().optional(),
  visible_from: z.date(),
  visible_until: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

export const InfoBannerForm = ({ bannerId }: InfoBannerFormProps) => {
  const { data: banner } = useInfoBanner(bannerId || '');
  const updateBanner = useUpdateInfoBanner(bannerId || '');
  const createBanner = useCreateInfoBanner();

  const form = useAppForm({
    validators: { onBlur: formSchema },
    defaultValues: {
      title: banner?.title || '',
      description: banner?.description || '',
      image: banner?.image ?? '',
      image_alt: banner?.image_alt || '',
      url: banner?.url || '',
      visible_from: banner ? parseISO(banner.visible_from) : new Date(),
      visible_until: banner ? parseISO(banner.visible_until) : new Date(),
    } as FormValues,
    async onSubmit({ value }) {
      if (updateBanner.isPending || createBanner.isPending) return;
      const infoBanner = {
        ...value,
        visible_from: value.visible_from.toJSON(),
        visible_until: value.visible_until.toJSON(),
      } as InfoBanner;
      if (bannerId) {
        await updateBanner.mutateAsync(infoBanner, {
          onSuccess: () => {
            toast.success('Banneret ble oppdatert.');
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        });
      } else {
        await createBanner.mutateAsync(infoBanner, {
          onSuccess: () => {
            toast.success('Banneret ble opprettet.');
            setValues(null);
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        });
      }
    },
  });

  const setValues = useCallback(
    (newValues: InfoBanner | null) => {
      form.setFieldValue('image', newValues?.image ?? '');
      form.setFieldValue('image_alt', newValues?.image_alt || '');
      form.setFieldValue('title', newValues?.title || '');
      form.setFieldValue('description', newValues?.description || '');
      form.setFieldValue('url', newValues?.url || '');
      form.setFieldValue('visible_from', newValues ? parseISO(newValues.visible_from) : new Date());
      form.setFieldValue('visible_until', newValues ? parseISO(newValues.visible_until) : new Date());
      if (!newValues) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        form.setFieldValue('visible_until', tomorrow);
      }
    },
    [form],
  );

  return (
    <ResponsiveDialog
      description={bannerId ? 'Her kan du redigere et banner' : 'Her kan du opprette et nytt banner'}
      title={bannerId ? 'Rediger banner' : 'Nytt banner'}
      trigger={
        <Button size={bannerId ? 'icon' : 'default'} variant={bannerId ? 'ghost' : 'default'}>
          {bannerId ? <Pencil className='h-4 w-4' /> : 'Nytt banner'}
        </Button>
      }>
      <ScrollArea className='h-[60vh]'>
        <form className='space-y-4 px-2 py-6' onSubmit={handleFormSubmit(form)}>
          <form.AppField name='title'>{(field) => <field.InputField label='Tittel' required />}</form.AppField>

          <div className='w-full flex items-center space-x-4'>
            <form.AppField name='visible_from'>{(field) => <field.DateTimeField label='Start' required />}</form.AppField>

            <form.AppField name='visible_until'>{(field) => <field.DateTimeField label='Slutt' required />}</form.AppField>
          </div>

          <form.AppField name='url'>{(field) => <field.InputField description='F.eks: https://tihlde.org eller https://nrk.no' label='Url' />}</form.AppField>

          <form.AppField name='description'>{(field) => <field.TextareaField label='Beskrivelse' required />}</form.AppField>

          <form.AppField name='image'>{(field) => <field.ImageUploadField label='Bilde' />}</form.AppField>

          <form.AppField name='image_alt'>{(field) => <field.InputField label='Alternativ bildetekst' />}</form.AppField>

          <form.AppForm>
            <form.SubmitButton className='w-full' disabled={createBanner.isPending || updateBanner.isPending}>
              {createBanner.isPending || updateBanner.isPending ? 'Lagrer...' : 'Lagre'}
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

const InfoBannerDeleteDialog = ({ bannerId }: InfoBannerFormProps) => {
  const deleteBanner = useDeleteInfoBanner(bannerId || '');
  const remove = () =>
    deleteBanner.mutate(null, {
      onSuccess: () => {
        toast.success('Banneret ble slettet.');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  return (
    <ResponsiveAlertDialog
      action={remove}
      description='Er du sikker på at du vil slette banneret? Dette kan ikke angres på.'
      title='Slett banner'
      trigger={
        <Button size='icon' variant='ghost'>
          <Trash className='h-4 w-4' />
        </Button>
      }
    />
  );
};

type InfoBannerItemProps = {
  banner: InfoBanner;
};

const InfoBannerItem = ({ banner }: InfoBannerItemProps) => {
  return (
    <div className='w-full p-4 border rounded-md flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <Info className='w-5 h-5 stroke-[1.5pcx]' />
        <div>
          <h1>{`Banner: "${banner.title}"`}</h1>
          <p className='text-sm text-muted-foreground'>
            {`Aktiv ${
              banner.is_visible
                ? 'nå'
                : formatDistance(parseISO(banner.visible_until), new Date(), {
                    includeSeconds: true,
                    addSuffix: true,
                    locale: nb,
                  })
            }. Vises på forsiden fra ${formatDate(parseISO(banner.visible_from))} til ${formatDate(parseISO(banner.visible_until))}.`}
          </p>
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        <InfoBannerForm bannerId={banner.id} />
        <InfoBannerDeleteDialog bannerId={banner.id} />
      </div>
    </div>
  );
};

export default InfoBannerItem;
