import { ReactNode } from 'react';
import { RegistrationPriority } from 'types';
import { UserClass, UserStudy } from 'types/Enums';
import { getUserStudyShort } from 'utils';

// Material UI Components
import { makeStyles } from 'makeStyles';
import { Typography } from '@mui/material';

const useStyles = makeStyles()((theme) => ({
  prioritiesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  priority: {
    padding: '0 3px',
    border: theme.palette.borderWidth + ' solid ' + theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    margin: 3,
    color: theme.palette.text.primary,
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
  priorities: Array<RegistrationPriority>;
};

const EventPriorities = ({ priorities }: EventPrioritesProps) => {
  const { classes } = useStyles();
  let prioritiesArr = [...priorities];
  const content: ReactNode[] = [];

  type ItemProps = {
    label: string;
  };

  const Item = ({ label }: ItemProps) => (
    <Typography className={classes.priority} component='span' variant='subtitle1'>
      {label}
    </Typography>
  );

  [UserStudy.DATAING, UserStudy.DIGFOR, UserStudy.DIGSEC, UserStudy.DIGSAM, UserStudy.DRIFT, UserStudy.INFO].forEach((study: UserStudy) => {
    if (study === UserStudy.DIGSAM) {
      if (
        prioritiesArr.some((item) => item.user_class === UserClass.FOURTH && item.user_study === study) &&
        prioritiesArr.some((item) => item.user_class === UserClass.FIFTH && item.user_study === study)
      ) {
        content.push(<Item key={study} label={getUserStudyShort(study)} />);
        prioritiesArr = removeStudyFromArray(prioritiesArr, study);
      }
    } else if (
      prioritiesArr.some((item) => item.user_class === UserClass.FIRST && item.user_study === study) &&
      prioritiesArr.some((item) => item.user_class === UserClass.SECOND && item.user_study === study) &&
      prioritiesArr.some((item) => item.user_class === UserClass.THIRD && item.user_study === study)
    ) {
      content.push(<Item key={study} label={getUserStudyShort(study)} />);
      prioritiesArr = removeStudyFromArray(prioritiesArr, study);
    }
  });

  return (
    <div className={classes.prioritiesContainer}>
      {content}
      {prioritiesArr.map((priority, index) => (
        <Item key={index} label={priority.user_class + '. ' + getUserStudyShort(priority.user_study)} />
      ))}
    </div>
  );
};

export default EventPriorities;
