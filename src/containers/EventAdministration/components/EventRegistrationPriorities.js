import React from 'react';
import PropTypes from 'prop-types';
import {getUserStudyShort} from '../../../utils';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  formWrapper: {
    width: '100%',
  },
  formGroup: {
    padding: '10px 0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    flexWrap: 'nowrap',
    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '1fr',
    },
  },
  formGroupSmall: {
    padding: '10px 0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  chipYes: {
    color: theme.colors.constant.white,
    backgroundColor: theme.colors.status.green,
    borderColor: theme.colors.status.green,
    '&:hover': {
      color: theme.colors.constant.white,
      backgroundColor: theme.colors.status.green + 'bb',
      borderColor: theme.colors.status.green + 'bb',
    },
  },
  chipNo: {
    color: theme.colors.status.red,
    backgroundColor: theme.colors.constant.white,
    borderColor: theme.colors.status.red,
    '&:hover': {
      color: theme.colors.status.red,
      borderColor: theme.colors.status.red,
    },
  },
  mr: {
    marginRight: 10,
    marginBottom: 5,
    flexGrow: 1,
  },
});

function EventEditor(props) {
  const {classes, event, setEvent} = props;

  const handlePriorityChange = (userClass, userStudy) => () => {
    if (event.registration_priorities.some((item) => item.user_class === userClass && item.user_study === userStudy)) {
      const newArray = event.registration_priorities.filter((item) => !(item.user_class === userClass && item.user_study === userStudy));
      setEvent({...event, registration_priorities: newArray});
    } else {
      const newArray = [...event.registration_priorities, {'user_class': userClass, 'user_study': userStudy}];
      setEvent({...event, registration_priorities: newArray});
    }
  };

  const toggleAllPriorities = (addAll) => () => {
    if (addAll) {
      setEvent({...event, registration_priorities: [{'user_class': 1, 'user_study': 1}, {'user_class': 1, 'user_study': 2}, {'user_class': 1, 'user_study': 3}, {'user_class': 1, 'user_study': 5}, {'user_class': 2, 'user_study': 1}, {'user_class': 2, 'user_study': 2}, {'user_class': 2, 'user_study': 3}, {'user_class': 2, 'user_study': 5}, {'user_class': 3, 'user_study': 1}, {'user_class': 3, 'user_study': 2}, {'user_class': 3, 'user_study': 3}, {'user_class': 3, 'user_study': 5}, {'user_class': 4, 'user_study': 4}, {'user_class': 5, 'user_study': 4}]});
    } else {
      setEvent({...event, registration_priorities: []});
    }
  };

  return (
    <div className={classes.formWrapper}>
      <FormGroup>
        {[1, 2, 3, 5].map((userStudy) => {
          return (
            <React.Fragment key={userStudy}>
              <FormLabel component="legend">{getUserStudyShort(userStudy)}</FormLabel>
              <FormGroup className={classes.formGroup} key={userStudy}>
                {[1, 2, 3].map((userClass) => {
                  return (
                    <Button
                      key={userClass}
                      className={classes.mr}
                      classes={event.registration_priorities.some((item) => item.user_class === userClass && item.user_study === userStudy) ? {outlinedPrimary: classes.chipYes} : {outlinedPrimary: classes.chipNo}}
                      variant='outlined'
                      color='primary'
                      onClick={handlePriorityChange(userClass, userStudy)}>
                      {userClass + '. ' + getUserStudyShort(userStudy)}
                    </Button>
                  );
                })}
              </FormGroup>
            </React.Fragment>
          );
        })}
        <FormLabel component="legend">{getUserStudyShort(4)}</FormLabel>
        <FormGroup className={classes.formGroup}>
          <Button
            className={classes.mr}
            classes={event.registration_priorities.some((item) => item.user_class === 4 && item.user_study === 4) ? {outlinedPrimary: classes.chipYes} : {outlinedPrimary: classes.chipNo}}
            variant='outlined'
            color='primary'
            onClick={handlePriorityChange(4, 4)}>
            {4 + '. ' + getUserStudyShort(4)}
          </Button>
          <Button
            className={classes.mr}
            classes={event.registration_priorities.some((item) => item.user_class === 5 && item.user_study === 4) ? {outlinedPrimary: classes.chipYes} : {outlinedPrimary: classes.chipNo}}
            variant='outlined'
            color='primary'
            onClick={handlePriorityChange(5, 4)}>
            {5 + '. ' + getUserStudyShort(4)}
          </Button>
        </FormGroup>
      </FormGroup>
      <FormGroup className={classes.formGroupSmall}>
        <Button className={classes.mr} variant='outlined' color='primary' onClick={toggleAllPriorities(true)}>Alle</Button>
        <Button className={classes.mr} variant='outlined' color='primary' onClick={toggleAllPriorities(false)}>Ingen</Button>
      </FormGroup>
    </div>
  );
}

EventEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  setEvent: PropTypes.func.isRequired,
};

export default withStyles(styles)(EventEditor);
