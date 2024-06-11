import { Outlet } from 'react-router-dom';

import Paper from 'components/layout/Paper';

const Groups = () => (
  <div className='w-full px-2 md:px-12 mt-40'>
    <Paper sx={{ margin: '-60px auto 60px', position: 'relative', minHeight: 200 }}>
      <Outlet />
    </Paper>
  </div>
);

export default Groups;
