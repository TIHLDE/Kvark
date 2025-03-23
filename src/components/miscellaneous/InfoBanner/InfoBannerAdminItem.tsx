import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistance, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Info, Pencil, Trash } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import DateTimePicker from '~/components/inputs/DateTimePicker';
import FormInput from '~/components/inputs/Input';
import FormTextarea from '~/components/inputs/Textarea';
import { FormImageUpload } from '~/components/inputs/Upload';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useCreateInfoBanner, useDeleteInfoBanner, useInfoBanner, useUpdateInfoBanner } from '~/hooks/InfoBanner';
import type { InfoBanner } from '~/types';
import { formatDate } from '~/utils';

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

export const InfoBannerForm = ({ bannerId }: InfoBannerFormProps) => {
  const { data: banner } = useInfoBanner(bannerId || '');
  const updateBanner = useUpdateInfoBanner(bannerId || '');
  const createBanner = useCreateInfoBanner();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: banner?.title || '',
      description: banner?.description || '',
      image: banner?.image ?? '',
      image_alt: banner?.image_alt || '',
      url: banner?.url || '',
      visible_from: banner ? parseISO(banner.visible_from) : new Date(),
      visible_until: banner ? parseISO(banner.visible_until) : new Date(),
    },
  });

  const setValues = useCallback(
    (newValues: InfoBanner | null) => {
      form.reset({
        image: newValues?.image ?? '',
        image_alt: newValues?.image_alt || '',
        title: newValues?.title || '',
        description: newValues?.description || '',
        url: newValues?.url || '',
        visible_from: newValues ? parseISO(newValues.visible_from) : new Date(),
        visible_until: newValues ? parseISO(newValues.visible_until) : new Date(),
      });
      if (!newValues) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        form.setValue('visible_until', tomorrow);
      }
    },
    [form.reset, form.setValue],
  );

  useEffect(() => {
    setValues(banner || null);
  }, [banner, setValues]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (updateBanner.isLoading || createBanner.isLoading) {
      return;
    }

    const infoBanner = {
      ...values,
      visible_from: values.visible_from.toJSON(),
      visible_until: values.visible_until.toJSON(),
    } as InfoBanner;
    if (bannerId) {
      updateBanner.mutate(infoBanner, {
        onSuccess: () => {
          toast.success('Banneret ble oppdatert.');
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      });
    } else {
      createBanner.mutate(infoBanner, {
        onSuccess: () => {
          toast.success('Banneret ble opprettet.');
          form.reset();
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      });
    }
  };

  const OpenButton = (
    <Button size={bannerId ? 'icon' : 'default'} variant={bannerId ? 'ghost' : 'default'}>
      {bannerId ? <Pencil className='h-4 w-4' /> : 'Nytt banner'}
    </Button>
  );

  return (
    <ResponsiveDialog
      description={bannerId ? 'Her kan du redigere et banner' : 'Her kan du opprette et nytt banner'}
      title={bannerId ? 'Rediger banner' : 'Nytt banner'}
      trigger={OpenButton}
    >
      <ScrollArea className='h-[60vh]'>
        <Form {...form}>
          <form className='space-y-4 px-2 py-6' onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput form={form} label='Tittel' name='title' required />

            <div className='w-full flex items-center space-x-4'>
              <DateTimePicker form={form} label='Start' name='visible_from' required />

              <DateTimePicker form={form} label='Slutt' name='visible_until' required />
            </div>

            <FormInput description='F.eks: https://tihlde.org eller https://nrk.no' form={form} label='Url' name='url' />

            <FormTextarea form={form} label='Beskrivelse' name='description' required />

            <FormImageUpload form={form} label='Bilde' name='image' ratio='21:9' />

            <FormInput form={form} label='Alternativ bildetekst' name='image_alt' />

            <Button className='w-full' disabled={createBanner.isLoading || updateBanner.isLoading}>
              {createBanner.isLoading || updateBanner.isLoading ? 'Lagrer...' : 'Lagre'}
            </Button>
          </form>
        </Form>
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

  const OpenButton = (
    <Button size='icon' variant='ghost'>
      <Trash className='h-4 w-4' />
    </Button>
  );

  return (
    <ResponsiveAlertDialog
      action={remove}
      description='Er du sikker på at du vil slette banneret? Dette kan ikke angres på.'
      title='Slett banner'
      trigger={OpenButton}
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
