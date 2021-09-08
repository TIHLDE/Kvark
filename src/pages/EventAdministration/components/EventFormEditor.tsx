import { EventForm } from 'types';
import { useFormById, useCreateForm } from 'hooks/Form';

// Material UI
import { Typography, Button, Box } from '@mui/material';

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
  }

  if (data === undefined || !formId) {
    return (
      <Button fullWidth onClick={onCreate} variant='outlined'>
        Opprett skjema
      </Button>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <FormEditor form={data} />
      <Typography sx={{ mt: 1 }} variant='body2'>
        {`OBS: Spørsmål til arrangement lagres uavhengig av resten av arrangementet! Du må altså trykke på "LAGRE"-knappen over for at spørsmålene skal lagres.`}
      </Typography>
    </Box>
  );
};

export default EventFormEditor;
