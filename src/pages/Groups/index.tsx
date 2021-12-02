import { Outlet } from 'react-router-dom';

import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import { PrimaryTopBox } from 'components/layout/TopBox';

const Groups = () => (
  <Page banner={<PrimaryTopBox />} options={{ title: 'Gruppeoversikt' }}>
    <Paper sx={{ margin: '-60px auto 60px', position: 'relative' }}>
      <Outlet />
    </Paper>
  </Page>
);

export default Groups;
