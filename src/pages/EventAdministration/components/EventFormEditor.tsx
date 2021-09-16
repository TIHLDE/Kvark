import { EventForm } from 'types';
import { useFormById, useCreateForm, useFormSubmissions } from 'hooks/Form';

// Material UI
import { Typography, Button } from '@mui/material';

// Project components
import FormEditor from 'components/forms/FormEditor';
import { FormType, FormResourceType } from 'types/Enums';

export type EventFormEditorProps = {
  eventId: number;
  formId: string | null;
  formType: FormType;
};

const EventFormEditor = ({ eventId, formId, formType }: EventFormEditorProps) => {
  const { data, isLoading } = useFormById(formId || '-');
  const { data: submissions } = useFormSubmissions(formId || '-', 1);
  const createForm = useCreateForm();

  const newForm: Omit<EventForm, 'event'> & { event: number } = {
    title: String(eventId),
    type: formType,
    event: eventId,
    resource_type: FormResourceType.EVENT_FORM,
    fields: [],
  };

  const onCreate = async () => createForm.mutate(newForm);

  if (!formId) {
    return (
      <Button fullWidth onClick={onCreate} variant='outlined'>
        Opprett skjema
      </Button>
    );
  } else if (isLoading || !data || !submissions) {
    return <Typography variant='body2'>Laster skjemaet</Typography>;
  } else if (submissions.count) {
    return <Typography variant='body2'>Du kan ikke endre spørsmålene etter at noen har svart på dem</Typography>;
  }

  return <FormEditor form={data} />;
};

export default EventFormEditor;
