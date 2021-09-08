import { useEventById } from 'hooks/Event';

// Material-UI
import { styled, Typography, LinearProgress } from '@mui/material';

// Project
import Expand from 'components/layout/Expand';
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

  return (
    <>
      <div>
        <Typography gutterBottom variant='h2'>
          Spørsmål ved påmelding
        </Typography>
        <Expansion flat header='Rediger spørsmål'>
          {event.list_count > 0 || event.waiting_list_count > 0 ? (
            <Typography variant='body2'>
              Du kan ikke endre spørsmålene etter at noen har svart på dem. Hvis du allikevel vil endre spørsmålene kan du fjerne alle påmeldte og alle på
              ventelisten.
            </Typography>
          ) : (
            <EventFormEditor eventId={eventId} formId={event.survey} />
          )}
        </Expansion>
        <Expansion flat header='Svar på flervalgsspørsmål'>
          <FormStatistics formId={event.survey} />
        </Expansion>
        <Expansion flat header='Alle svar'>
          <div />
        </Expansion>
      </div>
    </>
  );
};

export default EventFormAdmin;
