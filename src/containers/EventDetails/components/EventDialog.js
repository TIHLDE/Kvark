import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {shortDownString, getUserStudyLong} from '../../../utils';
import URLS from '../../../URLS';
import classNames from 'classnames';

// Text
import Text from '../../../text/EventText';

// Material-ui
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

// Icons
import AccountCircle from '@material-ui/icons/AccountCircle';
import Email from '@material-ui/icons/Email';
import Fastfood from '@material-ui/icons/Fastfood';
import School from '@material-ui/icons/School';
import Home from '@material-ui/icons/Home';

// Images
import eventSuccess from '../../../assets/img/eventSuccess.svg';
import eventCancel from '../../../assets/img/eventCancel.svg';

// Project components
import EventListItem from './EventListItem';

const style = {
  paper: {
    position: 'absolute',
    maxWidth: 460,
    minWidth: 320,
    maxHeight: '75%',
    display: 'flex',
    flexDirection: 'column',
    left: '50%',
    top: '50%',
    'overflow-y': 'auto',
    transform: 'translate(-50%,-50%)',
    '@media only screen and (max-width: 400px)': {
      width: '100%',
    },
    border: '1px solid #ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  heading: {
    display: 'flex',
    padding: 26,
  },
  message: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  messageText: {
    width: '100%',
    paddingRight: 24,
    textAlign: 'center',
  },
  image: {
    width: '50%',
    margin: 'auto',
  },
  title: {
    width: '100%',
  },
  content: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    'overflow-y': 'auto',
  },
  nestedElement: {
    paddingLeft: 32,
  },
  closeButton: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  button: {
    width: '100%',
    marginBottom: 10,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  footer: {
    padding: 26,
    textAlign: 'center',
  },
  text: {
    paddingBottom: 25,
  },
  progress: {
    margin: 26,
    position: 'relative',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginRight: -20,
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '20px 0px',
    padding: '20px 10px',
    border: '1px solid #ddd',
    borderRadius: 5,
    backgroundColor: '#f8f8fa',
  },
  question: {
    marginBottom: 20,
  },
};

const DialogHeader = (props) => {
  const {classes, heading} = props;
  return (
    <React.Fragment>
      <div className={classes.heading}>
        <Typography className={classes.title} align='center' variant='h5'>
          {heading}
        </Typography>
      </div>
      <Divider />
    </React.Fragment>
  );
};

const TextQuestion = (props) => {
  const {classes, optField, handleOptFieldInput, index} = props;
  const handleOptTextFieldChange = (e) => {
    const updatedField = {...optField};
    updatedField.answer = e.target.value;
    handleOptFieldInput(index, updatedField);
  };
  return (
    <TextField className={classNames(classes.question, classes.textField)} label={optField.title} required={optField.required} color='primary' value={optField.answer} onChange={handleOptTextFieldChange} />
  );
};
const RadioQuestion = (props) => {
  const {optField, handleOptFieldInput, index} = props;
  const handleOptRadioFieldChange = (e) => {
    const updatedField = {...optField};
    updatedField.answer = e.target.value;
    handleOptFieldInput(index, updatedField);
  };
  return (
    <FormControl component="fieldset" required={optField.required}>
      <FormLabel component="legend">{optField.title}</FormLabel>
      <RadioGroup aria-label={optField.title} name={optField.title} value={optField.answer} onChange={handleOptRadioFieldChange}>
        {optField.options.map((option, id) => {
          return (<FormControlLabel key={id} value={option.id} control={<Radio />} label={option.alternativ} />);
        })}
      </RadioGroup>
    </FormControl>
  );
};
const CheckQuestion = (props) => {
  const {optField, handleOptFieldInput, index} = props;
  const handleOptCheckFieldChange = (e) => {
    const updatedField = {...optField};
    if (updatedField.answer.includes(e.target.name)) {
      updatedField.answer.splice(updatedField.answer.indexOf(e.target.name), 1);
    } else {
      updatedField.answer.push(e.target.name);
    }
    handleOptFieldInput(index, updatedField);
  };
  return (
    <FormControl component="fieldset" required={optField.required}>
      <FormLabel component="legend">{optField.title}</FormLabel>
      <FormGroup>
        {optField.options.map((option, id) => {
          return (<FormControlLabel
            key={id}
            control={<Checkbox checked={optField.answer.includes(option.id)} onChange={handleOptCheckFieldChange} name={option.id} />}
            label={option.alternativ}
          />);
        })}
      </FormGroup>
    </FormControl>
  );
};

const Questions = (props) => {
  const {classes, optionalFieldsAnswers, handleOptionalFieldInput} = props;
  return (
    <div className={classes.questionsContainer}>
      <Typography variant="subtitle1">Spørsmål fra arrangøren:</Typography>
      {optionalFieldsAnswers.map((optField, index) => {
        if (optField.option_type === 0) {
          return (
            <TextQuestion key={index} index={index} classes={classes} optField={optField} handleOptFieldInput={handleOptionalFieldInput} />
          );
        } else if (optField.option_type === 1) {
          return (
            <RadioQuestion key={index} index={index} classes={classes} optField={optField} handleOptFieldInput={handleOptionalFieldInput} />
          );
        } else {
          return (
            <CheckQuestion key={index} index={index} classes={classes} optField={optField} handleOptFieldInput={handleOptionalFieldInput} />
          );
        }
      })}
    </div>
  );
};

const EventDialog = (props) => {
  const {classes, userData, userEvent, isApplying, message, applySuccess, data} = props;

  const [agreeRules, setAgreeRules] = useState(false);
  const [optionalFieldsAnswers, setOptionalFieldsAnswers] = useState([]);
  useEffect(() => {
    if (data.optionalFields) {
      for (let i = 0; i < data.optionalFields.length; i++) {
        const optionalField = {...data.optionalFields[i]};
        if (optionalField.option_type === 2) {
          optionalField.answer = [];
        } else {
          optionalField.answer = '';
        }
        setOptionalFieldsAnswers((optionalFieldsAnswers) => [...optionalFieldsAnswers, optionalField]);
      }
    }
  }, [data]);

  const handleOptionalFieldInput = (index, optField) => {
    const newOptionalFieldsAnswers = optionalFieldsAnswers.map((optionalField, id) => {
      if (index !== id) return optionalField;
      return optField;
    });
    setOptionalFieldsAnswers(newOptionalFieldsAnswers);
  };

  const closeDialog = () => {
    props.applyToEvent(optionalFieldsAnswers);
  };

  const questionsNotAnswered = (optFieldsAnswers) => {
    let isNotAnswered = false;
    optFieldsAnswers.forEach((optField) => {
      if (optField.required) {
        if (optField.option_type === 2) {
          if (!optField.answer || !optField.answer.length) isNotAnswered = true;
        } else {
          if (optField.answer.trim() === '') isNotAnswered = true;
        }
      }
    });
    return isNotAnswered;
  };

  const allergy = userData.allergy ?
    shortDownString(userData.allergy, 20) :
    'Ingen';
  const userStudy = getUserStudyLong(userData.user_study);
  const userClass = userData.user_class + '. Klasse';
  let headerText = '';
  const buttonColor = userEvent ? 'secondary' : 'primary';

  // Set correct headertext
  if (userEvent && !message) {
    headerText = Text.signOff;
  } else if (!userEvent && !message) {
    headerText = Text.signUp;
  } else if (applySuccess) {
    headerText = 'Vellykket';
  } else {
    headerText = 'En feil oppstod';
  }

  return (
    <Modal
      open={props.status}
      onClose={props.onClose}>
      <div className={classes.paper}>
        {!isApplying && !userEvent && message === '' &&
          <React.Fragment>
            <DialogHeader classes={classes} heading={Text.signUp} />
            <div className={classes.content}>
              <div className={classes.text}>
                <Typography>{Text.confirmData}</Typography>
              </div>
              <div className={classes.list}>
                <EventListItem
                  icon={<AccountCircle />}
                  text={'Navn: ' + userData.first_name + ' ' + userData.last_name}
                />
                <EventListItem
                  icon={<Email />}
                  text={'Epost: ' + userData.email}
                />
                <EventListItem
                  icon={<School />}
                  text={'Studieprogram: ' + userStudy}
                />
                <EventListItem
                  icon={<Home />}
                  text={'Klasse: ' + userClass}
                />
                <EventListItem
                  icon={<Fastfood />}
                  text={'Allergier: ' + allergy}
                />
                {optionalFieldsAnswers.length > 0 && <Questions classes={classes} optionalFieldsAnswers={optionalFieldsAnswers} handleOptionalFieldInput={handleOptionalFieldInput} />}
                <FormControlLabel
                  control={
                    <Checkbox onChange={(e) => setAgreeRules(e.target.checked)} checked={agreeRules} />
                  }
                  label="Jeg godtar arrangementsreglene"/>
                <Link href={URLS.eventRules} target="_blank" rel="noopener"><Typography variant="caption">Les arrangementsreglene her (åpnes i ny fane)</Typography></Link>
              </div>
            </div>
          </React.Fragment>
        }
        {!isApplying && userEvent && message === '' &&
            <React.Fragment>
              <DialogHeader classes={classes} heading={Text.signOff} />
              <div className={classes.content}>
                <div>
                  <Typography>Er du sikker på at du vil melde deg av? Om du melder deg på igjen vil du havne på bunnen av en eventuell venteliste.</Typography>
                </div>
              </div>
            </React.Fragment>
        }
        {isApplying &&
          <React.Fragment>
            <DialogHeader classes={classes} heading={Text.signUp} />
            <CircularProgress className={classes.progress} />
          </React.Fragment>
        }
        {message &&
          <React.Fragment>
            <DialogHeader classes={classes} heading={message} />
            <div className={classes.message}>
              {applySuccess ?
                <img alt="success" className={classes.image} src={eventSuccess}/> :
                <img alt="failure" className={classes.image} src={eventCancel}/>
              }
            </div>
          </React.Fragment>
        }
        <Divider />
        <div className={classes.footer}>
          {message ?
              <Button
                className={classes.button}
                onClick={props.onClose}
                align='center'
                variant='contained'
                color='primary'>Ok</Button> :
              <React.Fragment>
                <Button
                  className={classes.button}
                  onClick={closeDialog}
                  disabled={(isApplying || ((!userEvent && !agreeRules) || (!userEvent && questionsNotAnswered(optionalFieldsAnswers))))}
                  align='center'
                  variant='contained'
                  color={buttonColor}>{headerText}</Button>
                <Button
                  className={classes.button}
                  onClick={props.onClose}
                  align='center'
                  color='secondary'>Lukk</Button>
              </React.Fragment>
          }
        </div>
      </div>
    </Modal>
  );
};

DialogHeader.propTypes = {
  heading: PropTypes.string,
  classes: PropTypes.object,
};
TextQuestion.propTypes = {
  optField: PropTypes.object,
  classes: PropTypes.object,
  handleOptFieldInput: PropTypes.func,
  index: PropTypes.number,
};
RadioQuestion.propTypes = {
  optField: PropTypes.object,
  handleOptFieldInput: PropTypes.func,
  index: PropTypes.number,
};
CheckQuestion.propTypes = {
  optField: PropTypes.object,
  handleOptFieldInput: PropTypes.func,
  index: PropTypes.number,
};
Questions.propTypes = {
  classes: PropTypes.object,
  optionalFieldsAnswers: PropTypes.array,
  handleOptionalFieldInput: PropTypes.func,
};

EventDialog.propTypes = {
  status: PropTypes.bool,
  onClose: PropTypes.func,
  classes: PropTypes.object,
  userData: PropTypes.object,
  userEvent: PropTypes.object,
  applyToEvent: PropTypes.func,
  isApplying: PropTypes.bool,
  applySuccess: PropTypes.bool,
  message: PropTypes.string,
  data: PropTypes.object,
};

export default withStyles(style)(EventDialog);
