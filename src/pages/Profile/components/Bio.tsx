import { Box } from '@mui/material';

type BioProps = {
  bio?: string;
};

const Bio = ({ bio }: BioProps) => {
  return (
    <Box
      sx={{
        mx: 1,
      }}>
      {bio}
    </Box>
  );
};

export default Bio;
