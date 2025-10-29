import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import TIHLDELOGO from '~/assets/img/TihldeBackground.jpg';
import Page from '~/components/navigation/Page';
import { eventByIdQuery } from '~/hooks/Event';
import EventRenderer from '~/pages/EventDetails/components/EventRenderer';
import { getQueryClient } from '~/queryClient';

export const Route = createFileRoute('/_MainLayout/arrangementer/$id/{-$urlTitle}')({
  loader: async ({ params }) => {
    const eventId = Number(params.id);
    if (Number.isNaN(eventId) || eventId < 0) {
      throw redirect({ to: '/arrangementer' });
    }

    try {
      const event = await getQueryClient().ensureQueryData(eventByIdQuery(eventId));
      if (!event) {
        throw redirect({ to: '/arrangementer' });
      }
      return {
        eventId,
        event,
      };
    } catch {
      throw redirect({ to: '/arrangementer' });
    }
  },
  head: ({ loaderData }) => {
    return {
      meta: [
        { property: 'og:title', content: loaderData?.event?.title },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: typeof window !== 'undefined' ? window.location.href : '' },
        { property: 'og:image', content: loaderData?.event?.image ?? 'https://tihlde.org' + TIHLDELOGO },
      ],
    };
  },
  component: EventDetails,
});

function EventDetails() {
  const { eventId } = Route.useLoaderData();
  const { data: event } = useSuspenseQuery(eventByIdQuery(eventId));

  return (
    <Page>
      <EventRenderer data={event} />
    </Page>
  );
}
