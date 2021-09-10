import { EventForm } from 'types';
import { useFormById, useCreateForm } from 'hooks/Form';

// Material UI
import { Typography, Button } from '@mui/material';

// Project components
import FormEditor from 'components/forms/FormEditor';
import { FormType, FormResourceType } from 'types/Enums';

export type EventFormEditorProps = {
  eventId: number;
  formId: string | null;
};

const EventFormEditor = ({ eventId, formId }: EventFormEditorProps) => {
  const { data, isLoading } = useFormById(formId || '-');
  const createForm = useCreateForm();

  const newForm: EventForm = {
    title: String(eventId),
    type: FormType.SURVEY,
    event: eventId,
    resource_type: FormResourceType.EVENT_FORM,
    fields: [],
  };

  const onCreate = async () => createForm.mutate(newForm);

  if (isLoading) {
    return <Typography variant='h3'>Laster skjemaet</Typography>;
  } else if (!data || !formId) {
    return (
      <Button fullWidth onClick={onCreate} variant='outlined'>
        Opprett skjema
      </Button>
    );
  }

  return <FormEditor form={data} />;
};

export default EventFormEditor;
