import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCheatsheet, useUpdateCheatsheet, useDeleteCheatsheet, useCreateCheatsheet } from 'api/hooks/Cheatsheet';
import { useSnackbar } from 'api/hooks/Snackbar';
import { HavePermission } from 'api/hooks/User';
import { Cheatsheet } from 'types/Types';
import { Groups, Study } from 'types/Enums';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialTextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// Project components
import Dialog from 'components/layout/Dialog';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.common.white,
    borderColor: theme.palette.common.white + 'bb',
    '&:hover': {
      borderColor: theme.palette.common.white,
    },
  },
  deleteButton: {
    marginTop: theme.spacing(2),
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.light,
    },
  },
  treeWrapper: {
    margin: theme.spacing(1, 0, 2),
  },
  tree: {
    marginTop: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

type IFormProps = IPagesAdminProps & {
  mode: Modes;
  closeDialog: () => void;
};

type FormData = Pick<Cheatsheet, 'id' | 'title' | 'creator' | 'grade' | 'study' | 'course' | 'type' | 'official' | 'url'>;

const Form = ({ closeDialog, mode, study, grade, cheatsheets }: IFormProps) => {
  const classes = useStyles();
  const [selectedId, setSelectedId] = useState<string>('');
  const { data: cheatsheet } = useCheatsheet(study, grade, selectedId);
  const createCheatsheet = useCreateCheatsheet(study, grade);
  const updateCheatsheet = useUpdateCheatsheet(study, grade, cheatsheet.id || '');
  const deleteCheatsheet = useDeleteCheatsheet(study, grade, cheatsheet.id || '');
  const { register, errors, handleSubmit } = useForm(mode === Modes.EDIT ? { defaultValues: cheatsheet } : {});
  const showSnackbar = useSnackbar();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (data: FormData) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    if (mode === Modes.EDIT) {
      await updateCheatsheet.mutate(data, {
        onSuccess: () => {
          showSnackbar('Siden ble oppdatert', 'success');
          closeDialog();
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    } else {
      await createCheatsheet.mutate(data, {
        onSuccess: () => {
          showSnackbar('Siden ble opprettet', 'success');
          closeDialog();
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    }
    setIsLoading(false);
  };

  const handleDeletePage = async () => {
    await deleteCheatsheet.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        setShowDeleteDialog(false);
        closeDialog();
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <>
      {mode === Modes.EDIT && (
        <MaterialTextField
          fullWidth
          label='Studie'
          onChange={(e) => setSelectedId(e.target.value)}
          select
          style={{ gridArea: 'filterStudy' }}
          value={selectedId}
          variant='outlined'>
          {cheatsheets.map((item, i) => (
            <MenuItem key={i} value={item.id}>
              {`${item.title} ${item.course}`}
            </MenuItem>
          ))}
        </MaterialTextField>
      )}
      <form onSubmit={handleSubmit(submit)}>
        <TextField disabled={isLoading} errors={errors} label='Tittel' name='title' register={register} required rules={{ required: 'Feltet er påkrevd' }} />
        <TextField disabled={isLoading} errors={errors} label='Av' name='creator' register={register} required rules={{ required: 'Feltet er påkrevd' }} />
        <TextField disabled={isLoading} errors={errors} label='Klasse' name='grade' register={register} required rules={{ required: 'Feltet er påkrevd' }} />
        <TextField disabled={isLoading} errors={errors} label='Studie' name='study' register={register} required rules={{ required: 'Feltet er påkrevd' }} />
        <TextField disabled={isLoading} errors={errors} label='Type' name='type' register={register} required rules={{ required: 'Feltet er påkrevd' }} />
        <TextField disabled={isLoading} errors={errors} label='link' name='url' register={register} required rules={{ required: 'Feltet er påkrevd' }} />
        <SubmitButton disabled={isLoading} errors={errors}>
          {mode === Modes.EDIT ? 'Lagre' : 'Opprett'}
        </SubmitButton>
        {mode === Modes.EDIT && (
          <>
            <Button
              className={classes.deleteButton}
              color='inherit'
              disabled={isLoading}
              fullWidth
              onClick={() => setShowDeleteDialog(true)}
              variant='outlined'>
              Slett kok
            </Button>
            <Dialog confirmText='Slett' onClose={() => setShowDeleteDialog(false)} onConfirm={handleDeletePage} open={showDeleteDialog} titleText='Slett side'>
              Er du helt sikker på at du vil slette denne siden?
            </Dialog>
          </>
        )}
      </form>
    </>
  );
};

export type IPagesAdminProps = {
  cheatsheets: Cheatsheet[];
  study: Study;
  grade: number;
};
enum Modes {
  CREATE,
  EDIT,
}

const PagesAdmin = ({ cheatsheets, grade, study }: IPagesAdminProps) => {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState(Modes.CREATE);

  const edit = () => {
    setMode(Modes.EDIT);
    setShowDialog(true);
  };
  const create = () => {
    setMode(Modes.CREATE);
    setShowDialog(true);
  };

  return (
    <HavePermission groups={[Groups.HS, Groups.INDEX]}>
      <Button className={classes.button} color='inherit' fullWidth onClick={edit} variant='outlined'>
        Rediger side
      </Button>
      <Button className={classes.button} color='inherit' fullWidth onClick={create} variant='outlined'>
        Ny underside
      </Button>
      <Dialog onClose={() => setShowDialog(false)} open={showDialog} titleText={mode === Modes.EDIT ? 'Rediger side' : 'Opprett side'}>
        <Form cheatsheets={cheatsheets} closeDialog={() => setShowDialog(false)} grade={grade} mode={mode} study={study} />
      </Dialog>
    </HavePermission>
  );
};

export default PagesAdmin;
