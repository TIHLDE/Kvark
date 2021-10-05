import { useMemo } from 'react';
import Paper from 'components/layout/Paper';
import { formatDate } from 'utils';
import { parseISO } from 'date-fns';

// Material UI Components
import { makeStyles } from '@mui/styles';
import { Grid, Typography, Divider } from '@mui/material';

import VerifyDialog from 'components/layout/VerifyDialog';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2, 2, 2, 4),
  },
  list: {
    listStyleType: 'none',
    margin: 0,
  },
}));

export type StrikeListItemProps = {
  userId: string;
};

const StrikeListItem = ({ userId }: StrikeListItemProps) => {
  const classes = useStyles();
  //   const { data, hasNextPage, fetchNextPage, isFetching } = useUserStrikes();

  //   const strikes = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);
  const strikes: Array<number> = [1, 2, 3];
  return (
    <div>
      {/* <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere spørreskjemaer' nextPage={() => fetchNextPage()}> */}
      {strikes.map((strike) => (
        <>
          <Divider />
          <div className={classes.paper} key={strike}>
            <Grid alignItems='center' columns={{ xs: 2}} container direction='row' justifyContent='center'>
              <Grid item xs={2} >
                <Typography variant='h3'>{'strike.event.title'}</Typography>
                <Typography>Begrunnelse: {'strike.description'}</Typography>
                <Typography>
                  Antall prikker: <a style={{ color: 'red' }}>hello</a>
                </Typography>
                <Typography>Utløper {formatDate(parseISO('strike.expires_at'))}</Typography>
              </Grid>
              <Grid item xs={2}>
                <VerifyDialog
                  closeText='Ikke slett arrangementet'
                  color='error'
                  contentText='Sletting av arrangementer kan ikke reverseres.'
                  titleText='Er du sikker?'>
                  Slett
                </VerifyDialog>
              </Grid>
            </Grid>
          </div>
        </>
      ))}
      {/* // </Pagination> */}
    </div>
  );
};

export default StrikeListItem;
