import { useState, useRef } from 'react';
import { EventFormCreate, Form, TextFormField, SelectFormField } from 'types';
import { useFormById, useCreateForm, useFormSubmissions, useFormTemplates } from 'hooks/Form';
import { useForm } from 'react-hook-form';
// Material UI
import { Typography, Button, styled } from '@mui/material';

// Project components
import Expand from 'components/layout/Expand';
import FormEditor from 'components/forms/FormEditor';
import FormView from 'components/forms/FormView';
import { FormType, FormResourceType } from 'types/Enums';
import { Box } from '@mui/system';

export type EventFormEditorProps = {
  eventId: number;
  formId: string | null;
  formType: FormType;
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
  const { register, handleSubmit, formState, setError, getValues, control } = useForm<Form['fields']>();

  const newForm: EventFormCreate = {
    title: String(eventId),
    type: formType,
    event: eventId,
    resource_type: FormResourceType.EVENT_FORM,
    fields: [],
  };

  // fjerner all id fra templaten for å gjøre det sjemaet unikt
  const removeID = (obj: Record<string, any>) => {
    delete obj.id;
    Object.values(obj).forEach((val) => {
      if (typeof val === 'object' && val !== null) {
        removeID(val);
      }
    });
    return obj;
  };

  const onCreateFromTemplate = async (template: Form) => {
    const updatedTemplate = removeID(template);
    const newForm: EventFormCreate = {
      title: String(eventId),
      type: formType,
      event: eventId,
      resource_type: FormResourceType.EVENT_FORM,
      fields: updatedTemplate.fields,
    };
    createForm.mutate(newForm);
  };

  const onCreate = async () => createForm.mutate(newForm);

  if (!formId) {
    return (
      <Box>
        <Button fullWidth onClick={onCreate} variant='contained'>
          Opprett tomt skjema
        </Button>
        <Typography style={{ marginTop: 20 }} variant='h3'>
          Ferdige maler
        </Typography>
        <p>Bruk en mal som utgangspunkt når du oppretter ett skjema.</p>
        {formTemplates.map((formTemplate) => (
          <Expansion header={formTemplate.title} key={formTemplate.id} style={{ marginTop: 10 }}>
            <FormView control={control} disabled={true} form={formTemplate} formState={formState} getValues={getValues} register={register} />
            <Box style={{ display: 'flex' }}>
              <Button color='success' onClick={() => onCreateFromTemplate(formTemplate)} variant='outlined'>
                Bruk denne malen
              </Button>
              <Button color='error' variant='outlined'>
                Slett malen
              </Button>
            </Box>
          </Expansion>
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
