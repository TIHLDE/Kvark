import { Typography } from '@mui/material';

import Paper from 'components/layout/Paper';
import { PrimaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';

const PaymentOrderAdmin = () => {
  return (
    <Page banner={<PrimaryTopBox />} options={{ title: 'Betalingsordre admin' }}>
      <Paper sx={{ margin: '-60px auto 60px', position: 'relative' }}>
        <Typography variant='h1'>Betalingsordre admin</Typography>
      </Paper>
    </Page>
  );
};

export default PaymentOrderAdmin;
