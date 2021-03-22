import { useForm } from 'react-hook-form';
import { getUserStudyLong, getUserClass } from 'utils';
import { User } from 'types/Types';
import { useUpdateUser } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

// Project components
import TextField from 'components/inputs/TextField';
import Select from 'components/inputs/Select';
import SubmitButton from 'components/inputs/SubmitButton';
import { ImageUpload } from 'components/inputs/Upload';

const useStyles = makeStyles((theme) => ({
  selectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

export type ProfileSettingsProps = {
  user: User;
};

type FormData = Pick<User, 'cell' | 'image' | 'gender' | 'allergy' | 'tool' | 'user_class' | 'user_study'>;

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const updateUser = useUpdateUser();
  const { register, handleSubmit, errors, control, setValue, watch } = useForm<FormData>({ defaultValues: { ...user } });
  const updateData = (data: FormData) => {
    if (updateUser.isLoading) {
      return;
    }

    updateUser.mutate(
      { userId: user.user_id, user: data },
      {
        onSuccess: () => {
          showSnackbar('Bruker oppdatert', 'success');
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
        <TextField disabled={updateUser.isLoading} errors={errors} InputProps={{ type: 'number' }} label='Telefon' name='cell' register={register} />
        <ImageUpload errors={errors} label='Velg profilbilde' name='image' ratio={1} register={register} setValue={setValue} watch={watch} />
        <div className={classes.selectGrid}>
          <Select control={control} disabled errors={errors} label='Studie' name='user_study'>
            <MenuItem value={user.user_study}>{getUserStudyLong(user.user_study)}</MenuItem>
          </Select>
          <Select control={control} disabled errors={errors} label='Klasse' name='user_class'>
            <MenuItem value={user.user_class}>{getUserClass(user.user_class)}</MenuItem>
          </Select>
          <Select control={control} disabled={updateUser.isLoading} errors={errors} label='Kjønn' name='gender'>
            <MenuItem value={1}>Mann</MenuItem>
            <MenuItem value={2}>Kvinne</MenuItem>
            <MenuItem value={3}>Annet</MenuItem>
          </Select>
        </div>
        <TextField disabled={updateUser.isLoading} errors={errors} label='Kjøkkenredskap' name='tool' register={register} />
        <TextField disabled={updateUser.isLoading} errors={errors} label='Evt allergier og annen info' multiline name='allergy' register={register} rows={3} />
        <SubmitButton disabled={updateUser.isLoading} errors={errors}>
          Oppdater
        </SubmitButton>
      </form>
    );
  }
};

export default ProfileSettings;
