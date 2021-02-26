import { EventForm } from 'types/Types';
import { useFormById, useCreateForm } from 'api/hooks/Form';

// Material UI
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
      <Button color='primary' fullWidth onClick={onCreate} variant='outlined'>
        Opprett skjema
      </Button>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <FormEditor form={data} />
      <Typography style={{ marginTop: 8 }} variant='body2'>
        OBS: Spørsmål til arrangement lagres uavhengig av resten av skjemaet! Du må altså trykke på lagre over for at spørsmålene skal lagres
      </Typography>
    </div>
  );
};

export default EventFormEditor;
