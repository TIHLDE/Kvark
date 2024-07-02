import { Outlet } from 'react-router-dom';

import Page from 'components/navigation/Page';
import { Card } from 'components/ui/card';

const Groups = () => (
  <Page className='max-w-6xl mx-auto'>
    <Card>
      <Outlet />
    </Card>
  </Page>
);

export default Groups;
