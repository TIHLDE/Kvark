import { EventFormCreate } from 'types';
import { useFormById, useCreateForm } from 'hooks/Form';

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
  const createForm = useCreateForm();

  const newForm: EventFormCreate = {
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
  } else if (isLoading || !data) {
    return <Typography variant='body2'>Laster skjemaet</Typography>;
  }

  return <FormEditor form={data} />;
};

export default EventFormEditor;
