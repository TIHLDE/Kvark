import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { getEventByIdQuery } from '~/api/queries/events';
import EventRenderer from './components/EventRenderer';

export const Route = createFileRoute('/_MainLayout/arrangementer/$id/{-$urlTitle}')({
  component: EventDetails,
});

function EventDetails() {
  const { id } = Route.useParams();

  const { data: event } = useSuspenseQuery(getEventByIdQuery(id));

  return (
    <Page>
      <EventRenderer data={event} />
    </Page>
  );
}
