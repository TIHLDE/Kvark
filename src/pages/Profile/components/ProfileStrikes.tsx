import { useMemo } from 'react';
import Paper from 'components/layout/Paper';
import { formatDate } from 'utils';
import { parseISO } from 'date-fns';

// Material UI Components
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Pagination from 'components/layout/Pagination';

import { useUserStrikes } from 'hooks/User';

const useStyles = makeStyles({
  paper: {
    marginBottom: 15,
  },
  list: {
    listStyleType: 'none',
    margin: 0,
  },
});

const ProfileStrikes = () => {
  const classes = useStyles();
  const { data, hasNextPage, fetchNextPage, isFetching } = useUserStrikes();
  const strikes = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);
  if (!data) {
    return null;
  } else if (!strikes.length) {
    return <NotFoundIndicator header='Du har ingen prikker' subtitle='Du har vel oppført deg fint :)' />;
  }
  return (
    <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere spørreskjemaer' nextPage={() => fetchNextPage()}>
      {strikes?.map((strike) => (
        <Paper className={classes.paper} key={strike.id}>
          <Typography variant='h3'>{strike.event.title}</Typography>
          <ul className={classes.list}>
            <li>Begrunnelse: {strike.description}</li>
            <li>
              Antall prikker: <a style={{ color: 'red' }}>{strike.strike_size}</a>
            </li>
            <li>Utløper {formatDate(parseISO(strike.expires_at))}</li>
          </ul>
        </Paper>
      ))}
    </Pagination>
  );
};

export default ProfileStrikes;
