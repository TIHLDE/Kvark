import { useForm } from 'react-hook-form';
import { getUserStudyLong, getUserClass } from 'utils';
import { UserList } from 'types';
import { useUpdateUser } from 'hooks/User';
import { useSnackbar } from 'hooks/Snackbar';

// Material-UI
import { makeStyles } from '@mui/styles';
import { MenuItem, Typography } from '@mui/material';

// Project components
import TextField from 'components/inputs/TextField';
import Select from 'components/inputs/Select';
import SubmitButton from 'components/inputs/SubmitButton';
import { ImageUpload } from 'components/inputs/Upload';
import { useGoogleAnalytics } from 'hooks/Utils';

const useStyles = makeStyles((theme) => ({
  selectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  gutterTop: {
    marginTop: theme.spacing(2),
  },
}));

export type ProfileSettingsProps = {
  user: UserList;
  isAdmin?: boolean;
};

type FormData = Pick<UserList, 'first_name' | 'last_name' | 'email' | 'cell' | 'image' | 'gender' | 'allergy' | 'tool' | 'user_class' | 'user_study'>;

const ProfileSettings = ({ isAdmin, user }: ProfileSettingsProps) => {
  const classes = useStyles();
  const { event } = useGoogleAnalytics();
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
  } else {
    return (
      <form onSubmit={handleSubmit(updateData)}>
        {isAdmin && (
          <div className={classes.selectGrid}>
            <TextField disabled={updateUser.isLoading} formState={formState} label='Fornavn' {...register('first_name')} />
            <TextField disabled={updateUser.isLoading} formState={formState} label='Etternavn' {...register('last_name')} />
            <TextField disabled={updateUser.isLoading} formState={formState} label='Epost' {...register('email')} />
          </div>
        )}
        <TextField disabled={updateUser.isLoading} formState={formState} InputProps={{ type: 'number' }} label='Telefon' {...register('cell')} />
        <ImageUpload formState={formState} label='Velg profilbilde' ratio={1} register={register('image')} setValue={setValue} watch={watch} />
        <div className={classes.selectGrid}>
          <Select control={control} disabled={!isAdmin} formState={formState} label='Studie' name='user_study'>
            {[1, 2, 3, 4, 5].map((i) => (
              <MenuItem key={i} value={i}>
                {getUserStudyLong(i)}
              </MenuItem>
            ))}
          </Select>
          <Select control={control} disabled={!isAdmin} formState={formState} label='Klasse' name='user_class'>
            {[1, 2, 3, 4, 5].map((i) => (
              <MenuItem key={i} value={i}>
                {getUserClass(i)}
              </MenuItem>
            ))}
          </Select>
          <Select control={control} disabled={updateUser.isLoading} formState={formState} label='Kjønn' name='gender'>
            <MenuItem value={1}>Mann</MenuItem>
            <MenuItem value={2}>Kvinne</MenuItem>
            <MenuItem value={3}>Annet</MenuItem>
          </Select>
        </div>
        <TextField disabled={updateUser.isLoading} formState={formState} label='Kjøkkenredskap' {...register('tool')} />
        <TextField disabled={updateUser.isLoading} formState={formState} label='Evt allergier og annen info' multiline {...register('allergy')} minRows={3} />
        <SubmitButton disabled={updateUser.isLoading} formState={formState}>
          Oppdater
        </SubmitButton>
        {!isAdmin && (
          <Typography className={classes.gutterTop} variant='body2'>
            {`Er navn, epost, klasse eller studie er feil? Ta kontakt med oss på `}
            <a href='https://m.me/tihlde' rel='noopener noreferrer' target='_blank'>
              Messenger
            </a>
            {` eller Slack.`}
          </Typography>
        )}
      </form>
    );
  }
};

export default ProfileSettings;
