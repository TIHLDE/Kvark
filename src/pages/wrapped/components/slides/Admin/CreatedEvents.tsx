import { Typography } from '@mui/material';

import WrappedSchaffold from '../../WrappedSchaffold';
import { MainSlideProps } from '../utils/types';

const CreatedEvents = ({ data }: MainSlideProps) => {
  return (
    <WrappedSchaffold spacing='large' variant='vertical'>
      <Typography>Du har opprettet</Typography>
    </WrappedSchaffold>
  );
};

export default CreatedEvents;
