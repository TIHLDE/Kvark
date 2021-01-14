import { ReactNode } from 'react';
import { RegistrationPriority } from 'types/Types';
import { UserClass, UserStudy } from 'types/Enums';
import { getUserStudyShort } from 'utils';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) => ({
  info: {
    width: 'auto',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
    },
  },
  ml: {
    marginRight: 5,
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
  },
  prioritiesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-start',
    },
  },
  priority: {
    padding: '0 3px',
    border: theme.palette.borderWidth + ' solid ' + theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    margin: 3,
    color: theme.palette.text.secondary,
  },
}));

const removeStudyFromArray = (array: Array<RegistrationPriority>, userStudy: UserStudy) => {
  while (array.some((item) => item.user_study === userStudy)) {
    const index = array.findIndex((item) => item.user_study === userStudy);
    array.splice(index, 1);
  }
  return array;
};

export type EventPrioritesProps = {
  title: string;
  priorities: Array<RegistrationPriority>;
};

const EventPriorities = ({ title, priorities }: EventPrioritesProps) => {
  const classes = useStyles();
  let prioritiesArr = [...priorities];
  const content: ReactNode[] = [];

  [UserStudy.DATAING, UserStudy.DIGFOR, UserStudy.DIGSEC, UserStudy.DIGSAM, UserStudy.DRIFT].forEach((study: UserStudy) => {
    if (study === UserStudy.DIGSAM) {
      if (
        prioritiesArr.some((item) => item.user_class === UserClass.FOURTH && item.user_study === study) &&
        prioritiesArr.some((item) => item.user_class === UserClass.FIFTH && item.user_study === study)
      ) {
        content.push(
          <Typography className={classes.priority} key={study} variant='subtitle1'>
            {getUserStudyShort(study)}
          </Typography>,
        );
        prioritiesArr = removeStudyFromArray(prioritiesArr, study);
      }
    } else if (
      prioritiesArr.some((item) => item.user_class === UserClass.FIRST && item.user_study === study) &&
      prioritiesArr.some((item) => item.user_class === UserClass.SECOND && item.user_study === study) &&
      prioritiesArr.some((item) => item.user_class === UserClass.THIRD && item.user_study === study)
    ) {
      content.push(
        <Typography className={classes.priority} key={study} variant='subtitle1'>
          {getUserStudyShort(study)}
        </Typography>,
      );
      prioritiesArr = removeStudyFromArray(prioritiesArr, study);
    }
  });

  return (
    <Grid alignItems='center' className={classes.info} container justify='flex-start' wrap='nowrap'>
      <Typography className={classes.ml} variant='subtitle1'>
        {title}
      </Typography>
      <div className={classes.prioritiesContainer}>
        {content}
        {prioritiesArr.map((priority, index) => (
          <Typography className={classes.priority} key={index} variant='subtitle1'>
            {priority.user_class + '. ' + getUserStudyShort(priority.user_study)}
          </Typography>
        ))}
      </div>
    </Grid>
  );
};

export default EventPriorities;
