import { Outlet } from 'react-router-dom';

import { PrimaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';
import { Card, CardContent } from 'components/ui/card';

const Groups = () => (
  <Page banner={<PrimaryTopBox />}>
    <Card className='-mt-[60px] mb-12'>
      <CardContent className='p-6 relative min-h-[200px]'>
        <Outlet />
      </CardContent>
    </Card>
  </Page>
);

export default Groups;
