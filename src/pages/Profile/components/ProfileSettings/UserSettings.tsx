import { MenuItem, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { User } from 'types';

import { useSnackbar } from 'hooks/Snackbar';
import { useUpdateUser } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import Bool from 'components/inputs/Bool';
import Select from 'components/inputs/Select';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import { ShowMoreTooltip } from 'components/miscellaneous/UserInformation';

export type UserSettingsProps = {
  user: User;
  isAdmin?: boolean;
};

type FormData = Pick<
  User,
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'image'
  | 'gender'
  | 'allergy'
  | 'tool'
  | 'public_event_registrations'
  | 'accepts_event_rules'
  | 'allows_photo_by_default'
>;

export const UserSettings = ({ isAdmin, user }: UserSettingsProps) => {
  const { event } = useAnalytics();
  const showSnackbar = useSnackbar();
  const updateUser = useUpdateUser();

  const { register, handleSubmit, formState, control, setValue, watch } = useForm<FormData>({ defaultValues: { ...user } });
  const updateData = (data: FormData) => {
    if (updateUser.isLoading) {
      return;
    }
    updateUser.mutate(
      { userId: user.user_id, user: { ...user, ...data } },
      {
        onSuccess: () => {
          showSnackbar('Bruker oppdatert', 'success');
          event('update-settings', 'profile', 'Update');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
  };

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(updateData)}>
      {isAdmin && (
        <Stack direction={['column', 'row']} gap={[0, 1]}>
          <TextField disabled={updateUser.isLoading} formState={formState} label='Fornavn' {...register('first_name')} />
          <TextField disabled={updateUser.isLoading} formState={formState} label='Etternavn' {...register('last_name')} />
          <TextField disabled={updateUser.isLoading} formState={formState} label='Epost' {...register('email')} />
        </Stack>
      )}
      <ImageUpload formState={formState} label='Velg profilbilde' ratio='1:1' register={register('image')} setValue={setValue} watch={watch} />
      <Stack direction={['column', 'row']} gap={[0, 1]}>
        <Select control={control} disabled={updateUser.isLoading} formState={formState} label='Kjønn' name='gender'>
          <MenuItem value={1}>Mann</MenuItem>
          <MenuItem value={2}>Kvinne</MenuItem>
          <MenuItem value={3}>Annet</MenuItem>
        </Select>
      </Stack>
      <TextField disabled={updateUser.isLoading} formState={formState} label='Kjøkkenredskap' {...register('tool')} />
      <TextField
        disabled={updateUser.isLoading}
        formState={formState}
        helperText='Dine allergier vises til arrangører ved arrangementer'
        label='Dine allergier'
        multiline
        {...register('allergy')}
        minRows={1}
      />
      <Stack>
        <Bool
          control={control}
          disabled={updateUser.isLoading}
          formState={formState}
          label={
            <>
              Offentlige arrangementspåmeldinger
              <ShowMoreTooltip>
                Bestemmer:
                <br />
                1. Om du skal stå oppført med navnet ditt eller være anonym i deltagerlister på arrangementer.
                <br />
                2. Om arrangement-kalenderen din skal være aktivert og mulig å abonnere på.
              </ShowMoreTooltip>
            </>
          }
          name='public_event_registrations'
          type='checkbox'
        />
        <Bool
          control={control}
          disabled={updateUser.isLoading}
          formState={formState}
          label={
            <>
              Aksepterer <Link to='/wiki/arrangementsregler/'>arrangementreglene</Link>
            </>
          }
          name='accepts_event_rules'
          type='checkbox'
        />
        <Bool
          control={control}
          disabled={updateUser.isLoading}
          formState={formState}
          label='Jeg godtar at bilder av meg kan deles på TIHLDE sine plattformer'
          name='allows_photo_by_default'
          type='checkbox'
        />
      </Stack>
      <SubmitButton disabled={updateUser.isLoading} formState={formState}>
        Lagre
      </SubmitButton>
      {!isAdmin && (
        <Typography sx={{ mt: 1 }} variant='body2'>
          {`Er navn, epost, klasse eller studie er feil? Ta kontakt med oss på `}
          <a href='https://m.me/tihlde' rel='noopener noreferrer' target='_blank'>
            Messenger
          </a>
          {` eller Slack.`}
        </Typography>
      )}
    </form>
  );
};

export default UserSettings;
