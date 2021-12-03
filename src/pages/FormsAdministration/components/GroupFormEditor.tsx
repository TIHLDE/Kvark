// Material UI
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useForm } from 'react-hook-form';

import FormEditor from 'components/forms/FormEditor';
import { useCreateForm } from 'hooks/Form';
import { useCallback, useState } from 'react';
import { GroupFormCreate } from 'types';
import { useSnackbar } from 'hooks/Snackbar';

// Project components
import { FormResourceType } from 'types/Enums';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export type GroupFormCreateEditorProps = {
  groupSlug: string;
};

type FormData = {
  title: string;
};

const GroupFormCreateEditor = ({ groupSlug }: GroupFormCreateEditorProps) => {
  const classes = useStyles();
  const [title, setTitle] = useState<string>('');
  const { mutate: createForm, data, reset, isLoading } = useCreateForm();
  const { handleSubmit, formState, control, getValues, setError, register } = useForm<FormData>();

  const showSnackbar = useSnackbar();

  const newForm = (data: FormData) =>
    ({
      title: data.title,
      group: groupSlug,
      resource_type: FormResourceType.GROUP_FORM,
      fields: [],
    } as GroupFormCreate);

  const onCreate = async (data: FormData) => {
    createForm(newForm(data), {
      onSuccess: () => {
        showSnackbar('Skjemaet ble opprettet. Legg til noen spørsmål!', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const onReset = useCallback(() => {
    reset();
    setTitle('');
  }, [reset]);

  if (!data) {
    return (
      <form onSubmit={handleSubmit(onCreate)}>
        <TextField
          disabled={false}
          formState={formState}
          label='Tittel'
          required
          size='small'
          {...register('title', { required: 'Skjemaet må ha en tittel' })}
        />
        <SubmitButton disabled={isLoading} formState={formState} fullWidth variant='outlined'>
          Opprett nytt skjema
        </SubmitButton>
      </form>
    );
  }

  return (
    <div className={classes.root}>
      <FormEditor form={data} />
      <Button fullWidth onClick={onReset} variant='outlined'>
        Ferdig
      </Button>
    </div>
  );
};

export default GroupFormCreateEditor;
