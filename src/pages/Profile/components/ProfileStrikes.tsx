import { Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { useUser, useUserStrikes } from 'hooks/User';

import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import StrikeListItem from 'components/miscellaneous/StrikeListItem';

function ProfileStrikes() {
  const { data = [] } = useUserStrikes();
  const { data: user } = useUser();
  return (
    <Stack gap={1}>
      <Paper>
        <Typography>
          Informasjon om prikksystemet finner du i <Link to={URLS.eventRules}>arrangementsreglene</Link>.{' '}
          {Boolean(data.length) && (
            <span>
              Uenig i en prikk? Send epost til <a href='mailto:bedpres@tihlde.org'>bedpres@tihlde.org</a>.
            </span>
          )}
        </Typography>
      </Paper>
      {data.length ? (
        user && data.map((strike) => <StrikeListItem key={strike.id} strike={strike} user={user} />)
      ) : (
        <NotFoundIndicator header='Fant ingen prikker' subtitle='Du har ingen prikker!' />
      )}
    </Stack>
  );
}

export default ProfileStrikes;
