import { useEventById } from 'hooks/Event';

// Material-UI
import { styled, Typography, LinearProgress } from '@mui/material';

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

  const formExists = Boolean(event.survey);

  return (
    <>
      <div>
        <Typography gutterBottom variant='h3'>
          Spørsmål ved påmelding
        </Typography>
        <Expansion flat header={formExists ? 'Rediger spørsmål' : 'Opprett skjema'}>
          {event.list_count > 0 || event.waiting_list_count > 0 ? (
            <Typography variant='body2'>
              Du kan ikke endre spørsmålene etter at noen har svart på dem. Hvis du allikevel vil endre spørsmålene må du fjerne alle påmeldte og alle på
              ventelisten.
            </Typography>
          ) : (
            <EventFormEditor eventId={eventId} formId={event.survey} />
          )}
        </Expansion>
        {formExists && (
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
    </>
  );
};

export default EventFormAdmin;
