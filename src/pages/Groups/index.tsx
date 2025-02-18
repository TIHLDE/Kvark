import Page from '~/components/navigation/Page';
import { Card } from '~/components/ui/card';
import { Outlet } from 'react-router';

const Groups = () => (
  <Page className='max-w-6xl mx-auto'>
    <Card>
      <Outlet />
    </Card>
  </Page>
);

export default Groups;
