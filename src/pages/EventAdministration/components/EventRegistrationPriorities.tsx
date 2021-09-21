import { Fragment } from 'react';
import { getUserStudyShort } from 'utils';
import { RegistrationPriority } from 'types';
import { UserClass, UserStudy } from 'types/Enums';

// Material-UI
import { makeStyles } from '@mui/styles';
import { FormGroup, FormLabel, Button } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    width: '100%',
  },
  formGroup: {
    padding: '10px 0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
    },
  },
  formGroupSmall: {
    padding: '10px 0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  chipYes: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.success.dark,
    borderColor: theme.palette.success.dark,
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.success.main,
      borderColor: theme.palette.success.main,
    },
  },
  chipNo: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      color: theme.palette.error.light,
      borderColor: theme.palette.error.light,
    },
  },
  mr: {
    marginRight: 10,
    marginBottom: 5,
    flexGrow: 1,
  },
}));

export type EventRegistrationPrioritiesProps = {
  priorities: Array<RegistrationPriority>;
  setPriorities: (newPriorities: Array<RegistrationPriority>) => void;
};

const EventRegistrationPriorities = ({ priorities, setPriorities }: EventRegistrationPrioritiesProps) => {
  const classes = useStyles();

  const handlePriorityChange = (userClass: UserClass, userStudy: UserStudy) => () => {
    if (priorities.some((item) => item.user_class === userClass && item.user_study === userStudy)) {
      const newPrioritiesArray = priorities.filter((item) => !(item.user_class === userClass && item.user_study === userStudy));
      setPriorities(newPrioritiesArray);
    } else {
      const newPrioritiesArray = [...priorities, { user_class: userClass, user_study: userStudy }];
      setPriorities(newPrioritiesArray);
    }
  };

  const toggleAllPriorities = (addAll: boolean) => () => {
    if (addAll) {
      setPriorities([
        { user_class: 1, user_study: 1 },
        { user_class: 1, user_study: 2 },
        { user_class: 1, user_study: 3 },
        { user_class: 1, user_study: 5 },
        { user_class: 2, user_study: 1 },
        { user_class: 2, user_study: 2 },
        { user_class: 2, user_study: 3 },
        { user_class: 2, user_study: 5 },
        { user_class: 3, user_study: 1 },
        { user_class: 3, user_study: 2 },
        { user_class: 3, user_study: 3 },
        { user_class: 3, user_study: 5 },
        { user_class: 4, user_study: 4 },
        { user_class: 5, user_study: 4 },
      ]);
    } else {
      setPriorities([]);
    }
  };

  return (
    <div className={classes.formWrapper}>
      <FormGroup>
        {[1, 2, 3, 5].map((userStudy) => {
          return (
            <Fragment key={userStudy}>
              <FormLabel component='legend'>{getUserStudyShort(userStudy)}</FormLabel>
              <FormGroup className={classes.formGroup} key={userStudy}>
                {[1, 2, 3].map((userClass) => {
                  return (
                    <Button
                      classes={
                        priorities.some((item) => item.user_class === userClass && item.user_study === userStudy)
                          ? { outlinedPrimary: classes.chipYes }
                          : { outlinedPrimary: classes.chipNo }
                      }
                      className={classes.mr}
                      key={userClass}
                      onClick={handlePriorityChange(userClass, userStudy)}
                      variant='outlined'>
                      {userClass + '. ' + getUserStudyShort(userStudy)}
                    </Button>
                  );
                })}
              </FormGroup>
            </Fragment>
          );
        })}
        <FormLabel component='legend'>{getUserStudyShort(4)}</FormLabel>
        <FormGroup className={classes.formGroup}>
          <Button
            classes={
              priorities.some((item) => item.user_class === 4 && item.user_study === 4)
                ? { outlinedPrimary: classes.chipYes }
                : { outlinedPrimary: classes.chipNo }
            }
            className={classes.mr}
            onClick={handlePriorityChange(4, 4)}
            variant='outlined'>
            {4 + '. ' + getUserStudyShort(4)}
          </Button>
          <Button
            classes={
              priorities.some((item) => item.user_class === 5 && item.user_study === 4)
                ? { outlinedPrimary: classes.chipYes }
                : { outlinedPrimary: classes.chipNo }
            }
            className={classes.mr}
            onClick={handlePriorityChange(5, 4)}
            variant='outlined'>
            {5 + '. ' + getUserStudyShort(4)}
          </Button>
        </FormGroup>
      </FormGroup>
      <FormGroup className={classes.formGroupSmall}>
        <Button className={classes.mr} onClick={toggleAllPriorities(true)} variant='outlined'>
          Alle
        </Button>
        <Button className={classes.mr} onClick={toggleAllPriorities(false)} variant='outlined'>
          Ingen
        </Button>
      </FormGroup>
    </div>
  );
};

export default EventRegistrationPriorities;
