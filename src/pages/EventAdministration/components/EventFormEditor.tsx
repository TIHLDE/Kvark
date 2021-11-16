import { EventFormCreate, Form } from 'types';
import { useFormById, useCreateForm, useFormSubmissions, useFormTemplates, useDeleteForm } from 'hooks/Form';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'hooks/Snackbar';
// Material UI
import { Typography, Button, styled, Stack } from '@mui/material';

// Project components
import Expand from 'components/layout/Expand';
import FormEditor from 'components/forms/FormEditor';
import FormView from 'components/forms/FormView';
import { FormType, FormResourceType } from 'types/Enums';
import { Box } from '@mui/system';
import VerifyDialog from 'components/layout/VerifyDialog';

export type EventFormEditorProps = {
  eventId: number;
  formId: string | null;
  formType: FormType;
};

export type delteFormButtonType = {
  formId: string;
};

type FormTemplatePreviewType = Omit<EventFormEditorProps, 'formId'> & {
  formTemplate: Form;
};

const FormTemplatePreview = ({ formTemplate, eventId, formType }: FormTemplatePreviewType) => {
  const deleteForm = useDeleteForm(formTemplate.id || '-');
  const { register, handleSubmit, formState, setError, getValues, control } = useForm<Form['fields']>();
  const createForm = useCreateForm();
  const showSnackbar = useSnackbar();

  const onCreateFormFromTemplate = async () => {
    const updatedTemplate = removeID(formTemplate);
    const newForm: EventFormCreate = {
      title: String(eventId),
      type: formType,
      event: eventId,
      resource_type: FormResourceType.EVENT_FORM,
      fields: updatedTemplate.fields,
      template: false,
    };
    createForm.mutate(newForm, {
      onSuccess: (data) => {
        showSnackbar(data.title, 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  // fjerner all id fra templaten for å gjøre det sjemaet unikt
  const onDeleteForm = () => {
    deleteForm.mutate(undefined, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const removeID = (obj: Record<string, any>) => {
    delete obj.id;
    Object.values(obj).forEach((val) => {
      if (typeof val === 'object' && val !== null) {
        removeID(val);
      }
    });
    return obj;
  };

  return (
    <Expansion header={formTemplate.title} key={formTemplate.id}>
      <FormView control={control} disabled={true} form={formTemplate} formState={formState} getValues={getValues} register={register} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ p: 1 }}>
        <Button fullWidth onClick={() => onCreateFormFromTemplate()} variant='outlined'>
          Bruk denne malen
        </Button>
        <VerifyDialog color='warning' contentText='Å slette en mal kan ikke reverseres.' onConfirm={onDeleteForm} titleText='Er du sikker?'>
          Slett malen
        </VerifyDialog>
      </Stack>
    </Expansion>
  );
};

const Expansion = styled(Expand)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.smoke,
}));

const EventFormEditor = ({ eventId, formId, formType }: EventFormEditorProps) => {
  const { data, isLoading } = useFormById(formId || '-');
  const { data: submissions } = useFormSubmissions(formId || '-', 1);
  const createForm = useCreateForm();
  const { data: formTemplates = [] } = useFormTemplates();

  const newForm: EventFormCreate = {
    title: String(eventId),
    type: formType,
    event: eventId,
    resource_type: FormResourceType.EVENT_FORM,
    fields: [],
    template: false,
  };

  const onCreate = async () => createForm.mutate(newForm);

  if (!formId) {
    return (
      <Box>
        <Button fullWidth onClick={onCreate} variant='contained'>
          Opprett tomt skjema
        </Button>
        <Typography sx={{ mt: 2 }} variant='h3'>
          Ferdige maler
        </Typography>
        <Typography variant='body2'>Bruk en mal som utgangspunkt når du oppretter ett skjema.</Typography>
        {formTemplates.map((formTemplate) => (
          <Box key={formTemplate.id}>
            <FormTemplatePreview eventId={eventId} formTemplate={formTemplate} formType={formType} />
          </Box>
        ))}
      </Box>
    );
  } else if (isLoading || !data || !submissions) {
    return <Typography variant='body2'>Laster skjemaet</Typography>;
  } else if (submissions.count) {
    return <Typography variant='body2'>Du kan ikke endre spørsmålene etter at noen har svart på dem.</Typography>;
  }

  return <FormEditor form={data} />;
};

export default EventFormEditor;
