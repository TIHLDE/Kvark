import { EventFormCreate } from 'types';
import { EventFormType, FormResourceType } from 'types/Enums';
import { useEventById } from 'hooks/Event';
import { useCreateForm } from 'hooks/Form';
import { Typography, LinearProgress, Stack, Button } from '@mui/material';

// Project
import FormAdmin from 'components/forms/FormAdmin';
import { ShowMoreText } from 'components/miscellaneous/UserInformation';

export type EventFormAdminProps = {
  eventId: number;
};

const EventFormAdmin = ({ eventId }: EventFormAdminProps) => {
  const { data: event, isLoading } = useEventById(eventId);

  if (isLoading || !event) {
    return <LinearProgress />;
  }

  type EventFormEditorProps = {
    formType: EventFormType;
  };

  const EventFormEditor = ({ formType }: EventFormEditorProps) => {
    const createForm = useCreateForm();

    const newForm: EventFormCreate = {
      title: `${event.title} - ${formType === EventFormType.SURVEY ? 'påmeldingsskjema' : 'evalueringsskjema'}`,
      type: formType,
      event: event.id,
      resource_type: FormResourceType.EVENT_FORM,
      fields: [],
    };

    const onCreate = async () => createForm.mutate(newForm);

    return (
      <Button fullWidth onClick={onCreate} variant='outlined'>
        Opprett {formType === EventFormType.SURVEY ? 'påmeldingsskjema' : 'evalueringsskjema'}
      </Button>
    );
  };

  return (
    <Stack gap={2}>
      <div>
        <Typography variant='h3'>Spørsmål ved påmelding</Typography>
        <ShowMoreText sx={{ mb: 1 }}>
          Deltagere som melder seg på dette arrangementet vil måtte svare på disse spørsmålene først. Deltagerne kan la være å svare på spørsmål som ikke er
          &quot;Påkrevd&quot;.
        </ShowMoreText>
        {event.survey ? <FormAdmin formId={event.survey} /> : <EventFormEditor formType={EventFormType.SURVEY} />}
      </div>
      <div>
        <Typography variant='h3'>Evalueringsspørsmål</Typography>
        <ShowMoreText sx={{ mb: 1 }}>
          Deltagerne som deltar på dette arrangementet <b>må</b> svare på disse spørsmålene før de kan melde seg på andre arrangementer. Blokkeringen av
          påmelding trer i kraft når deltageren blir markert som &quot;Ankommet&quot;, og forsvinner med en gang deltageren har svart på evalueringsskjemaet.
          Deltagerne vil motta epost med påminnelse om å svare på skjemaet kl 12.00 dagen etter arrangementet.
        </ShowMoreText>
        {event.evaluation ? <FormAdmin formId={event.evaluation} /> : <EventFormEditor formType={EventFormType.EVALUATION} />}
      </div>
    </Stack>
  );
};

export default EventFormAdmin;
