import { SubmitHandler, useForm } from 'react-hook-form';
import { Form, GroupForm, GroupFormUpdate } from 'types';
import { FormResourceType } from 'types/Enums';
import { useUpdateForm, useDeleteForm } from 'hooks/Form';
import { useSnackbar } from 'hooks/Snackbar';
import { Stack } from '@mui/material';

// Project components
import VerifyDialog from 'components/layout/VerifyDialog';
import SubmitButton from 'components/inputs/SubmitButton';
import Bool from 'components/inputs/Bool';
import TextField from 'components/inputs/TextField';
import { ShowMoreTooltip } from 'components/miscellaneous/UserInformation';

export type FormDetailsEditorProps = {
  form: Form;
};

const DeleteFormButton = ({ form }: FormDetailsEditorProps) => {
  const deleteForm = useDeleteForm(form.id);

  return (
    <VerifyDialog
      color='error'
      contentText='Sletting av skjema kan ikke reverseres.'
      disabled={deleteForm.isLoading}
      onConfirm={() => deleteForm.mutate(undefined)}>
      Slett spørreskjema
    </VerifyDialog>
  );
};

type GroupFormDetailsEditorProps = {
  form: GroupForm;
};

type GroupFormUpdateValues = Pick<GroupFormUpdate, 'can_submit_multiple' | 'is_open_for_submissions' | 'only_for_group_members' | 'title'>;

const GroupFormDetailsEditor = ({ form }: GroupFormDetailsEditorProps) => {
  const updateForm = useUpdateForm(form.id || '-');
  const showSnackbar = useSnackbar();
  const { handleSubmit, register, formState, control } = useForm<GroupFormUpdateValues>({
    defaultValues: {
      can_submit_multiple: form.can_submit_multiple,
      is_open_for_submissions: form.is_open_for_submissions,
      only_for_group_members: form.only_for_group_members,
      title: form.title,
    },
  });

  const save: SubmitHandler<GroupFormUpdateValues> = (data) => {
    updateForm.mutate(
      { resource_type: form.resource_type, ...data },
      {
        onSuccess: () => {
          showSnackbar('Spørsmålene ble oppdatert', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
  };

  return (
    <>
      <Stack component='form' gap={1} onSubmit={handleSubmit(save)}>
        <TextField disabled={updateForm.isLoading} formState={formState} label='Tittel' {...register('title', { required: 'Feltet er påkrevd' })} required />
        <Bool
          control={control}
          formState={formState}
          label={
            <>
              Tillat flere innsendinger
              <ShowMoreTooltip>Bestemmer om brukere kan svare på dette spørreskjemaet flere ganger.</ShowMoreTooltip>
            </>
          }
          name='can_submit_multiple'
          type='checkbox'
        />
        <Bool
          control={control}
          formState={formState}
          label={
            <>
              Åpent for innsending
              <ShowMoreTooltip>
                Bestemmer om spørreskjemaet er åpent for innsending og brukere dermed kan svare på det. Hvis bryteren er avslått så kan ingen svare på skjemaet,
                og ingen kan heller se/finne det.
              </ShowMoreTooltip>
            </>
          }
          name='is_open_for_submissions'
          type='checkbox'
        />
        <Bool
          control={control}
          formState={formState}
          label={
            <>
              Kun for medlemmer av gruppen
              <ShowMoreTooltip>
                Bestemmer hvem som kan svare på dette spørreskjemaet. Hvis bryteren er påslått så vil kun medlemmer av gruppen kunne svare på spørreskjemaet, og
                personer som ikke er medlem vil ikke kunne se/finne spørreskjemaet.
              </ShowMoreTooltip>
            </>
          }
          name='only_for_group_members'
          type='checkbox'
        />
        <SubmitButton disabled={updateForm.isLoading} formState={formState}>
          Lagre
        </SubmitButton>
        <DeleteFormButton form={form} />
      </Stack>
    </>
  );
};

const FormDetailsEditor = ({ form }: FormDetailsEditorProps) =>
  form.resource_type === FormResourceType.GROUP_FORM ? <GroupFormDetailsEditor form={form} /> : <DeleteFormButton form={form} />;

export default FormDetailsEditor;
