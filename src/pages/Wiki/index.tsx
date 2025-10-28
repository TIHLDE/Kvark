import { createFileRoute, redirect } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';

export const Route = createFileRoute('/_MainLayout/wiki/*')({
  beforeLoad() {
    throw redirect({ href: 'https://wiki.tihlde.org/' });
  },
  component: Wiki,
});

function Wiki() {
  return (
    <Page>
      <h1>Sender seg til ny wiki: https://wiki.tihlde.org/</h1>
    </Page>
  );
}
