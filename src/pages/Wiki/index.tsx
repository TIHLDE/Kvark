import Page from '~/components/navigation/Page';
import { replace } from 'react-router';

export function clientLoader() {
  return replace('https://wiki.tihlde.org/');
}

export default function Wiki() {
  return (
    <Page>
      <h1>Sender seg til ny wiki: https://wiki.tihlde.org/</h1>
    </Page>
  );
}
