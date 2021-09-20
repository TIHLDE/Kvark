import { useEventById } from 'hooks/Event';
import { FormType } from 'types/Enums';

// Material-UI
import { styled, Typography, LinearProgress, Stack } from '@mui/material';

// Project
import Expand from 'components/layout/Expand';
import FormAnswers from 'components/forms/FormAnswers';
import FormStatistics from 'components/forms/FormStatistics';
import EventFormEditor from 'pages/EventAdministration/components/EventFormEditor';

export type EventFormAdminProps = {
  eventId: number;
};

const Expansion = styled(Expand)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.smoke,
}));

const EventFormAdmin = ({ eventId }: EventFormAdminProps) => {
  const { data: event, isLoading } = useEventById(eventId);

  if (isLoading || !event) {
    return <LinearProgress />;
  }

  const surveyFormExists = Boolean(event.survey);
  const evaluationFormExists = Boolean(event.evaluation);

  return (
    <Stack gap={2}>
      <div>
        <Typography variant='h3'>Spørsmål ved påmelding</Typography>
        <Typography variant='caption'>
          Deltagere som melder seg på dette arrangementet vil måtte svare på disse spørsmålene først. Deltagerne kan la være å svare på spørsmål som ikke er
          &quot;Påkrevd&quot;.
        </Typography>
        <Expansion flat header={surveyFormExists ? 'Rediger påmeldingsspørsmål' : 'Opprett påmeldingsskjema'} sx={{ mt: 1 }}>
          <EventFormEditor eventId={eventId} formId={event.survey} formType={FormType.SURVEY} />
        </Expansion>
        {surveyFormExists && (
          <>
            <Expansion flat header='Sammendrag av flervalgsspørsmål'>
              <FormStatistics formId={event.survey} />
            </Expansion>
            <Expansion flat header='Alle svar'>
              <FormAnswers formId={event.survey} />
            </Expansion>
          </>
        )}
      </div>
      <div>
        <Typography variant='h3'>Evalueringsspørsmål</Typography>
        <Typography variant='caption'>
          Deltagerne som deltar på dette arrangementet <b>må</b> svare på disse spørsmålene før de kan melde seg på andre arrangementer. Blokkeringen av
          påmelding trer i kraft når deltageren blir markert som &quot;Ankommet&quot;, og forsvinner med en gang deltageren har svart på evalueringsskjemaet.
          Deltagerne vil motta epost med påminnelse om å svare på skjemaet kl 12.00 dagen etter arrangementet.
        </Typography>
        <Expansion flat header={evaluationFormExists ? 'Rediger evalueringsspørsmål' : 'Opprett evalueringsskjema'} sx={{ mt: 1 }}>
          <EventFormEditor eventId={eventId} formId={event.evaluation} formType={FormType.EVALUATION} />
        </Expansion>
        {evaluationFormExists && (
          <>
            <Expansion flat header='Sammendrag av flervalgsspørsmål'>
              <FormStatistics formId={event.evaluation} />
            </Expansion>
            <Expansion flat header='Alle svar'>
              <FormAnswers formId={event.evaluation} />
            </Expansion>
          </>
        )}
      </div>
    </Stack>
  );
};

export default EventFormAdmin;
