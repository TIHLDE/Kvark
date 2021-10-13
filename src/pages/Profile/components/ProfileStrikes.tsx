import { Typography, Paper, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import StrikeListItem from 'components/miscellaneous/StrikeListItem';
import { useUserStrikes, useUser } from 'hooks/User';
import URLS from 'URLS';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

function ProfileStrikes() {
  const { data = [] } = useUserStrikes();
  const { data: user } = useUser();
  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 2 }}>
        <Typography>
          Informasjon om prikksystemet finner du ved <Link to={URLS.eventRules}>arrangementsreglene</Link>.{' '}
          {data && (
            <span>
              Feil med prikkene? Send mail til <a href='mailto:bedpres@tihlde.org'>bedpres@tihlde.org</a>
            </span>
          )}
        </Typography>
      </Paper>
      {data ? (
        user && data.map((strike) => <StrikeListItem key={strike.id} strike={strike} userId={user.user_id} />)
      ) : (
        <NotFoundIndicator header='Fant ingen prikker' subtitle='Du har ingen prikker!' />
      )}
    </Stack>
  );
}

export default ProfileStrikes;
