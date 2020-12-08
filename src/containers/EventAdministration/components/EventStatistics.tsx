import React, { useMemo } from 'react';
import { Registration } from 'types/Types';
import { getUserClass, getUserStudyShort } from 'utils';

// Material-UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Project components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  innerGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    color: theme.palette.colors.text.light,
    gridGap: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  lightText: {
    color: theme.palette.colors.text.light,
  },
  statistics: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    backgroundColor: theme.palette.colors.background.smoke,
    borderCollapse: 'collapse',
  },
  number: {
    fontSize: '2.1rem',
  },
}));

export type EventStatisticsProps = {
  registrations: Array<Registration>;
};

const EventStatistics = ({ registrations }: EventStatisticsProps) => {
  const classes = useStyles();

  const attendedNumber = useMemo(() => registrations.filter((x) => x.has_attended).length, [registrations]);

  const classNo = (userClass: number) => {
    const no = registrations.filter((registration) => registration.user_info.user_class === userClass).length;
    return no > 0 ? no : '0';
  };
  const studyNo = (userStudy: number) => {
    const no = registrations.filter((registration) => registration.user_info.user_study === userStudy).length;
    return no > 0 ? no : '0';
  };

  return (
    <>
      <Typography className={classes.lightText}>{`Ankommet: ${attendedNumber} av ${registrations.length} påmeldte`}</Typography>
      <div className={classes.root}>
        <div>
          <Typography className={classes.lightText}>Klasse:</Typography>
          <div className={classes.innerGrid}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Paper className={classes.statistics} key={i} noPadding>
                <Typography variant='subtitle2'>{getUserClass(i)}</Typography>
                <Typography className={classes.number} variant='h3'>
                  {classNo(i)}
                </Typography>
              </Paper>
            ))}
          </div>
        </div>
        <div>
          <Typography className={classes.lightText}>Studie:</Typography>
          <div className={classes.innerGrid}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Paper className={classes.statistics} key={i} noPadding>
                <Typography variant='subtitle2'>{getUserStudyShort(i)}</Typography>
                <Typography className={classes.number} variant='h3'>
                  {studyNo(i)}
                </Typography>
              </Paper>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventStatistics;
