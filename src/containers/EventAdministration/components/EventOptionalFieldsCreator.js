import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material UI Components
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Icons
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

// Project components
import Paper from '../../../components/layout/Paper';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  button: {
    marginTop: 10,
  },
  optField: {
    display: 'flex',
    flexDirection: 'column',
  },
  borderTop: {
    padding: '5px 5px 15px 15px',
    backgroundColor: theme.palette.colors.background.main,
    marginBottom: 10,
  },
  optFieldQuestion: {
    display: 'flex',
    flexDirection: 'row',
  },
  optFieldHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textField: {
    width: '100%',
  },
  deleteIcon: {
    color: theme.palette.colors.status.red,
  },
  optionIcon: {
    marginRight: 10,
    marginTop: 15,
  },
  switch: {
    height: 28,
    marginRight: 0,
  },
});

function OptTextField(props) {
  const { classes, id, optField, handleOptFieldChange, handleRemoveOptField } = props;

  const handleOptTextFieldChange = (e) => {
    const updatedField = { ...optField };
    updatedField.title = e.target.value;
    handleOptFieldChange(id, updatedField);
  };
  const handleSwitchChange = (e) => {
    const updatedField = { ...optField };
    updatedField.required = e.target.checked;
    handleOptFieldChange(id, updatedField);
  };

  return (
    <Paper className={classNames(classes.optField, classes.borderTop)} noPadding>
      <div className={classes.optFieldHeader}>
        <Typography variant='subtitle1'>Tekstspørsmål</Typography>
        <FormControlLabel
          className={classes.switch}
          control={<Checkbox checked={optField.required} color='primary' onChange={handleSwitchChange} />}
          label='Obligatorisk'
          labelPlacement='start'
          value='start'
        />
      </div>
      <div className={classes.optFieldQuestion}>
        <TextField className={classes.textField} color='primary' label='Spørsmål' onChange={handleOptTextFieldChange} value={optField.title} />
        <IconButton aria-label='Slett spørsmål' className={classes.deleteIcon} component='span' onClick={handleRemoveOptField(id)}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </div>
    </Paper>
  );
}
OptTextField.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.number,
  optField: PropTypes.object,
  handleOptFieldChange: PropTypes.func,
  handleRemoveOptField: PropTypes.func,
};
const OptionalTextField = withStyles(styles)(OptTextField);

function OptPickField(props) {
  const { classes, id, optField, handleOptFieldChange, handleRemoveOptField, isCheckbox } = props;

  const handleOptTextFieldChange = (e) => {
    const updatedField = { ...optField };
    updatedField.title = e.target.value;
    handleOptFieldChange(id, updatedField);
  };
  const handleSwitchChange = (e) => {
    const updatedField = { ...optField };
    updatedField.required = e.target.checked;
    handleOptFieldChange(id, updatedField);
  };
  const handleOptionsChange = (newOptions) => {
    const updatedField = { ...optField };
    updatedField.alternatives = newOptions;
    handleOptFieldChange(id, updatedField);
  };

  return (
    <Paper className={classNames(classes.optField, classes.borderTop)} noPadding>
      <div className={classes.optFieldHeader}>
        <Typography variant='subtitle1'>{isCheckbox ? 'Avkrysningsspørsmål' : 'Flervalgsspørsmål'}</Typography>
        <FormControlLabel
          className={classes.switch}
          control={<Checkbox checked={optField.required} color='primary' onChange={handleSwitchChange} />}
          label='Obligatorisk'
          labelPlacement='start'
          value='start'
        />
      </div>
      <div className={classes.optFieldQuestion}>
        <TextField className={classes.textField} color='primary' label='Spørsmål' onChange={handleOptTextFieldChange} value={optField.title} />
        <IconButton aria-label='Slett spørsmål' className={classes.deleteIcon} component='span' onClick={handleRemoveOptField(id)}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </div>
      <OptionalFieldOption handleOptionsChange={handleOptionsChange} isCheckbox={isCheckbox} options={optField.alternatives} />
    </Paper>
  );
}
OptPickField.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.number,
  optField: PropTypes.object,
  handleOptFieldChange: PropTypes.func,
  handleRemoveOptField: PropTypes.func,
  isCheckbox: PropTypes.bool,
};
const OptionalPickField = withStyles(styles)(OptPickField);

function OptFieldOption(props) {
  const { classes, options, handleOptionsChange, isCheckbox } = props;

  const handleOptionFieldChange = (id) => (e) => {
    const updatedOptions = [...options];
    updatedOptions[id] = e.target.value;
    handleOptionsChange(updatedOptions);
  };
  const handleAddOptionField = () => {
    const updatedOptions = [...options];
    updatedOptions.push('');
    handleOptionsChange(updatedOptions);
  };
  const handleRemoveOptionField = (id) => () => {
    const updatedOptions = [...options];
    updatedOptions.splice(id, 1);
    handleOptionsChange(updatedOptions);
  };

  const TypeIcon = () => {
    if (isCheckbox) {
      return <CheckBoxOutlineBlankIcon className={classes.optionIcon} />;
    } else {
      return <RadioButtonUncheckedIcon className={classes.optionIcon} />;
    }
  };

  return (
    <div className={classes.optField}>
      {options &&
        options.map((option, id) => (
          <div className={classes.optFieldQuestion} key={id}>
            <TypeIcon />
            <TextField className={classes.textField} color='primary' label='Alternativ' onChange={handleOptionFieldChange(id)} value={option} />
            <IconButton aria-label='Slett alternativ' component='span' onClick={handleRemoveOptionField(id)}>
              <ClearOutlinedIcon />
            </IconButton>
          </div>
        ))}
      <Button className={classes.button} color='primary' onClick={handleAddOptionField}>
        Legg til alternativ
      </Button>
    </div>
  );
}
OptFieldOption.propTypes = {
  classes: PropTypes.object,
  options: PropTypes.array,
  handleOptionsChange: PropTypes.func,
  isCheckbox: PropTypes.bool,
};
const OptionalFieldOption = withStyles(styles)(OptFieldOption);

function EventOptionalFieldsCreator(props) {
  const { classes, handleOptionalFields, optionalFields } = props;
  const [newQuestionMenu, setNewQuestionMenu] = useState(null);

  const handleFieldMenuClick = (event) => setNewQuestionMenu(event.currentTarget);
  const handleFieldMenuClose = () => setNewQuestionMenu(null);

  const handleOptionalFieldChange = (id, optField) => {
    const newOptFields = optionalFields.map((optionalField, sId) => {
      if (id !== sId) {
        return optionalField;
      }
      return optField;
    });
    handleOptionalFields(newOptFields);
  };

  const handleAddOptionalTextField = () => {
    handleFieldMenuClose();
    handleOptionalFields(optionalFields.concat([{ option_type: 0, title: '', required: true }]));
  };
  const handleAddOptionalRadioField = () => {
    handleFieldMenuClose();
    handleOptionalFields(optionalFields.concat([{ option_type: 1, title: '', required: true, alternatives: [''] }]));
  };
  const handleAddOptionalCheckboxField = () => {
    handleFieldMenuClose();
    handleOptionalFields(optionalFields.concat([{ option_type: 2, title: '', required: true, alternatives: [''] }]));
  };

  const handleRemoveOptionalField = (id) => () => {
    handleOptionalFields(optionalFields.filter((s, sId) => id !== sId));
  };

  return (
    <div className={classes.root}>
      {optionalFields.map((optField, id) => {
        if (optField.option_type === 0) {
          return (
            <OptionalTextField
              handleOptFieldChange={handleOptionalFieldChange}
              handleRemoveOptField={handleRemoveOptionalField}
              id={id}
              key={id}
              optField={optField}
            />
          );
        } else if (optField.option_type === 1) {
          return (
            <OptionalPickField
              handleOptFieldChange={handleOptionalFieldChange}
              handleRemoveOptField={handleRemoveOptionalField}
              id={id}
              isCheckbox={false}
              key={id}
              optField={optField}
            />
          );
        } else {
          return (
            <OptionalPickField
              handleOptFieldChange={handleOptionalFieldChange}
              handleRemoveOptField={handleRemoveOptionalField}
              id={id}
              isCheckbox={true}
              key={id}
              optField={optField}
            />
          );
        }
      })}
      <Button aria-controls='simple-menu' aria-haspopup='true' color='primary' onClick={handleFieldMenuClick} variant='outlined'>
        Legg til spørsmål
      </Button>
      <Menu anchorEl={newQuestionMenu} id='simple-menu' keepMounted onClose={handleFieldMenuClose} open={Boolean(newQuestionMenu)}>
        <MenuItem onClick={handleAddOptionalTextField}>Tekstspørsmål</MenuItem>
        <MenuItem onClick={handleAddOptionalRadioField}>Flervalgsspørsmål</MenuItem>
        <MenuItem onClick={handleAddOptionalCheckboxField}>Avkrysningsspørsmål</MenuItem>
      </Menu>
    </div>
  );
}

EventOptionalFieldsCreator.propTypes = {
  classes: PropTypes.object,
  optionalFields: PropTypes.array,
  handleOptionalFields: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(EventOptionalFieldsCreator);
