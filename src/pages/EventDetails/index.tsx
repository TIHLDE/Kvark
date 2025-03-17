import API from '~/api/api';
import TIHLDELOGO from '~/assets/img/TihldeBackground.jpg';
import Page from '~/components/navigation/Page';
import EventRenderer from '~/pages/EventDetails/components/EventRenderer';
import { redirect } from 'react-router';

import type { Route } from './+types/index';

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = Number(params.id);
  if (Number.isNaN(eventId) || eventId < 0) {
    throw redirect('/arrangementer/');
  }
  try {
    return {
      event: await API.getEvent(eventId),
    };
  } catch {
    throw redirect('/arrangementer/');
  }
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { property: 'og:title', content: data.event.title },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:image', content: data.event.image || 'https://tihlde.org' + TIHLDELOGO },
  ];
}

export default function EventDetails({ loaderData }: Route.ComponentProps) {
  const { event } = loaderData;

  return (
    <Page>
      <EventRenderer data={event} />
    </Page>
  );
}
