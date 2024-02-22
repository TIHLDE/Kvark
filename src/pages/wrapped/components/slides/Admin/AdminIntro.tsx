import { Typography } from '@mui/material';

import WrappedSchaffold from '../../WrappedSchaffold';
import { fadeIn, slideIn } from '../utils/animations';
import { MainSlideProps } from '../utils/types';

const AdminIntro = ({ data }: MainSlideProps) => {
  return (
    <WrappedSchaffold spacing='medium' variant='vertical'>
      <Typography
        sx={{
          animation: `${slideIn} 500ms ease-in-out`,
        }}
        textTransform={'uppercase'}
        variant='h2'>
        Vi har hørt fra våre kilder at du er en administrator.
      </Typography>
      <Typography
        sx={{
          animation: `${fadeIn} 500ms ease-in-out 3s both`,
        }}
        textTransform={'uppercase'}
        variant='h2'>
        La oss ta en nærmere titt på det...
      </Typography>
    </WrappedSchaffold>
  );
};

export default AdminIntro;
