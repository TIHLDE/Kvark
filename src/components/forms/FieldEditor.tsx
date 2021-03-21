import { useMemo } from 'react';
import { TextFormField, SelectFormField } from 'types/Types';
import { FormFieldType } from 'types/Enums';
import classnames from 'classnames';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';

// Icons
import DeleteIcon from '@material-ui/icons/DeleteOutlineRounded';
import ClearIcon from '@material-ui/icons/ClearRounded';
import RadioButtonIcon from '@material-ui/icons/RadioButtonUncheckedRounded';
import CheckBoxIcon from '@material-ui/icons/CheckBoxOutlineBlankRounded';

// Project components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'grid',
    gridGap: theme.spacing(1),
    padding: theme.spacing(1, 1, 2, 2),
    background: theme.palette.background.default,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridGap: theme.spacing(1),
    alignItems: 'center',
  },
  optionRow: {
    gridTemplateColumns: 'auto 1fr 48px',
  },
  checkbox: {
    marginRight: theme.spacing(0.5),
    height: 28,
  },
  deleteIcon: {
    color: theme.palette.error.main,
  },
}));

export type FieldEditorProps = {
  field: TextFormField | SelectFormField;
  updateField: (newField: TextFormField | SelectFormField) => void;
  removeField: () => void;
};

const FieldEditor = ({ field, updateField, removeField }: FieldEditorProps) => {
  const classes = useStyles();

  const addFieldOption = () => {
    if (field.type !== FormFieldType.TEXT_ANSWER) {
      updateField({ ...field, options: [...field.options, { title: '' }] });
    }
  };

  const updateFieldOption = (newValue: string, index: number) => {
    if (field.type !== FormFieldType.TEXT_ANSWER) {
      const newOptions = field.options.map((option, i) => (i === index ? { ...option, title: newValue } : option));
      updateField({ ...field, options: newOptions });
    }
  };

  const deleteFieldOption = (index: number) => {
    if (field.type !== FormFieldType.TEXT_ANSWER) {
      const newOptions = field.options.filter((option, i) => i !== index);
      updateField({ ...field, options: newOptions });
    }
  };

  const title = useMemo(() => {
    switch (field.type) {
      case FormFieldType.TEXT_ANSWER:
        return 'Tekstspørsmål';
      case FormFieldType.SINGLE_SELECT:
        return 'Flervalgsspørsmål';
      case FormFieldType.MULTIPLE_SELECT:
        return 'Avkrysningsspørsmål';
    }
  }, [field]);

  const TypeIcon = useMemo(() => (field.type === FormFieldType.SINGLE_SELECT ? RadioButtonIcon : CheckBoxIcon), [field]);

  return (
    <Paper className={classes.root} noPadding>
      <div className={classes.row}>
        <Typography variant='subtitle1'>{title}</Typography>
        <FormControlLabel
          className={classes.checkbox}
          control={<Checkbox checked={field.required} color='primary' onChange={(e) => updateField({ ...field, required: e.target.checked })} />}
          label='Påkrevd'
          labelPlacement='start'
        />
      </div>
      <div className={classes.row}>
        <TextField fullWidth label='Spørsmål' onChange={(e) => updateField({ ...field, title: e.target.value })} size='small' value={field.title} />
        <IconButton className={classes.deleteIcon} onClick={removeField}>
          <DeleteIcon />
        </IconButton>
      </div>
      {field.type !== FormFieldType.TEXT_ANSWER && (
        <>
          {field.options.map((option, index) => (
            <Grow in key={index} timeout={1000}>
              <div className={classnames(classes.row, classes.optionRow)}>
                <TypeIcon />
                <TextField fullWidth label='Alternativ' onChange={(e) => updateFieldOption(e.target.value, index)} size='small' value={option.title} />
                {field.options.length > 1 && (
                  <IconButton onClick={() => deleteFieldOption(index)}>
                    <ClearIcon />
                  </IconButton>
                )}
              </div>
            </Grow>
          ))}
          <Button color='primary' onClick={addFieldOption}>
            Legg til alternativ
          </Button>
        </>
      )}
    </Paper>
  );
};

export default FieldEditor;
