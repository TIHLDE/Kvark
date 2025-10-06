import { useSuspenseQuery } from '@tanstack/react-query';
import TIHLDELOGO from '~/assets/img/TihldeBackground.jpg';
import Page from '~/components/navigation/Page';
import { eventByIdQuery } from '~/hooks/Event';
import EventRenderer from '~/pages/EventDetails/components/EventRenderer';
import { getQueryClient } from '~/queryClient';
import { redirect } from 'react-router';

import { Route } from './+types/index';

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = Number(params.id);
  if (Number.isNaN(eventId) || eventId < 0) {
    throw redirect('/arrangementer/');
  }

  try {
    const event = await getQueryClient().ensureQueryData(eventByIdQuery(eventId));
    if (!event) {
      throw redirect('/arrangementer/');
    }
    return {
      eventId,
      event,
    };
  } catch {
    throw redirect('/arrangementer/');
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { property: 'og:title', content: loaderData?.event?.title },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:image', content: loaderData?.event?.image ?? 'https://tihlde.org' + TIHLDELOGO },
  ];
}

export default function EventDetails({ loaderData }: Route.ComponentProps) {
  const { eventId } = loaderData;
  const { data: event } = useSuspenseQuery(eventByIdQuery(eventId));

  return (
    <Page>
      <EventRenderer data={event} />
    </Page>
  );
}
