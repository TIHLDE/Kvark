import { Button, Stack, styled } from '@mui/material';
import { parseISO } from 'date-fns';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { InfoBanner } from 'types';

import { useCreateInfoBanner, useDeleteInfoBanner, useInfoBanner, useUpdateInfoBanner } from 'hooks/InfoBanner';
import { useSnackbar } from 'hooks/Snackbar';

import DatePicker from 'components/inputs/DatePicker';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import VerifyDialog from 'components/layout/VerifyDialog';

export type InfoBannerAdminItemProps = {
  bannerId?: string;
  onClose?: () => void;
};

export type InfoBannerDeleteProps = {
  bannerId: string | null;
};

const Row = styled(Stack)(({ theme }) => ({
  gap: 0,
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(2),
    flexDirection: 'row',
  },
}));

const InfoBannerDeleteDialog = ({ bannerId }: InfoBannerDeleteProps) => {
  const showSnackbar = useSnackbar();
  const deleteBanner = useDeleteInfoBanner(bannerId || '');
  const remove = async () =>
    deleteBanner.mutate(null, {
      onSuccess: () => {
        showSnackbar('Banneret ble slettet', 'success');
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  return (
    <VerifyDialog
      color='error'
      dialogChildren={
        <Button color='error' fullWidth onClick={remove} sx={{ mt: 2, mb: 0 }} variant='outlined'>
          Slett banner
        </Button>
      }
      fullWidth
      sx={{ mt: 1 }}
      variant='outlined'>
      Slett banner
    </VerifyDialog>
  );
};

type FormData = Pick<InfoBanner, 'title' | 'description' | 'image_alt' | 'image' | 'url'> & { visible_from: Date; visible_until: Date };

export const InfoBannerAdminItem = ({ bannerId, onClose }: InfoBannerAdminItemProps) => {
  const showSnackbar = useSnackbar();
  const { data } = useInfoBanner(bannerId || '');
  const updateBanner = useUpdateInfoBanner(bannerId || '');
  const createBanner = useCreateInfoBanner();

  const { register, handleSubmit, formState, control, setValue, getValues, reset, watch } = useForm<FormData>();

  const setValues = useCallback(
    (newValues: InfoBanner | null) => {
      reset({
        image: newValues?.image || '',
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
        setValue('visible_until', tomorrow);
      }
    },
    [reset],
  );

  useEffect(() => {
    setValues(data || null);
  }, [data, setValues]);

  const updateData = (data: FormData) => {
    if (updateBanner.isLoading) {
      return;
    }
    const infoBanner = {
      ...data,
      visible_from: data.visible_from.toJSON(),
      visible_until: data.visible_until.toJSON(),
    } as InfoBanner;
    if (bannerId) {
      updateBanner.mutate(infoBanner, {
        onSuccess: () => {
          showSnackbar('Banneret ble oppdatert.', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    } else {
      createBanner.mutate(infoBanner, {
        onSuccess: () => {
          showSnackbar('Banneret ble opprettet.', 'success');
          if (onClose !== undefined) {
            onClose();
          }
          reset();
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(updateData)}>
      <TextField disabled={updateBanner.isLoading} formState={formState} label='Tittel' required sx={{ width: '100%' }} {...register('title')} />
      <Row>
        <DatePicker
          control={control}
          formState={formState}
          label='Start'
          name='visible_from'
          onDateChange={() => {
            if (getValues().visible_until < getValues().visible_from) {
              setValue('visible_until', getValues().visible_from);
            }
          }}
          required
          rules={{ required: 'Feltet er påkrevd' }}
          type='date-time'
        />
        <DatePicker
          control={control}
          formState={formState}
          label='Slutt'
          name='visible_until'
          required
          rules={{
            required: 'Feltet er påkrevd',
            validate: {
              afterStartDate: (value) => value > getValues().visible_from || 'Slutt på visning må være etter start på visning',
            },
          }}
          type='date-time'
        />
      </Row>
      <TextField
        disabled={updateBanner.isLoading}
        formState={formState}
        label='URL'
        multiline
        {...register('url')}
        helperText='F,eks: https://tihlde.org eller https://nrk.no'
      />
      <TextField disabled={updateBanner.isLoading} formState={formState} label='Beskrivelse' multiline required {...register('description')} minRows={2} />
      <ImageUpload formState={formState} label='Velg bilde' ratio='21:9' register={register('image')} setValue={setValue} watch={watch} />
      <TextField disabled={updateBanner.isLoading} formState={formState} label='Alternativ bildetekst' {...register('image_alt')} />
      <SubmitButton disabled={updateBanner.isLoading} formState={formState}>
        Lagre
      </SubmitButton>
      {bannerId && <InfoBannerDeleteDialog bannerId={bannerId} />}
    </form>
  );
};

export default InfoBannerAdminItem;
