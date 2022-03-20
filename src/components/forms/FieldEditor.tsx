import CheckBoxIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import ClearIcon from '@mui/icons-material/ClearRounded';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import DragHandleIcon from '@mui/icons-material/DragHandleRounded';
import RadioButtonIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { Button, Checkbox, FormControlLabel, Grow, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useMemo } from 'react';
import { useDrag } from 'react-dnd';

import { SelectFormField, TextFormField } from 'types';
import { FormFieldType } from 'types/Enums';

import Paper from 'components/layout/Paper';

const useStyles = makeStyles()((theme) => ({
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
  disabled?: boolean;
};

const FieldEditor = ({ field, updateField, removeField, disabled = false }: FieldEditorProps) => {
  const { classes, cx } = useStyles();

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'field',
    collect: (monitor) => ({
      isDragging: Boolean(monitor.isDragging()),
    }),
  }));

  const addFieldOption = () => {
    if (field.type !== FormFieldType.TEXT_ANSWER && !disabled) {
      updateField({ ...field, options: [...field.options, { title: '' }] });
    }
  };

  const updateFieldOption = (newValue: string, index: number) => {
    if (field.type !== FormFieldType.TEXT_ANSWER && !disabled) {
      const newOptions = field.options.map((option, i) => (i === index ? { ...option, title: newValue } : option));
      updateField({ ...field, options: newOptions });
    }
  };

  const deleteFieldOption = (index: number) => {
    if (field.type !== FormFieldType.TEXT_ANSWER && !disabled) {
      const newOptions = field.options.filter((option, i) => i !== index);
      updateField({ ...field, options: newOptions });
    }
  };

  const [title, description] = useMemo(() => {
    switch (field.type) {
      case FormFieldType.TEXT_ANSWER:
        return ['Tekstspørsmål', 'Bruker kan svare med tekst'];
      case FormFieldType.SINGLE_SELECT:
        return ['Flervalgsspørsmål', 'Bruker kan velge kun ett alternativ'];
      case FormFieldType.MULTIPLE_SELECT:
        return ['Avkrysningsspørsmål', 'Bruker kan velge ett eller flere alternativ'];
    }
  }, [field]);

  const TypeIcon = useMemo(() => (field.type === FormFieldType.SINGLE_SELECT ? RadioButtonIcon : CheckBoxIcon), [field]);

  return (
    <Paper className={classes.root} noPadding ref={preview} sx={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className={classes.row}>
        <Stack direction='row' gap={1} ref={drag}>
          <DragHandleIcon />
          <Tooltip placement='top-start' title={description}>
            <Typography sx={{ color: (theme) => theme.palette.text[disabled ? 'disabled' : 'primary'] }} variant='subtitle1'>
              {title}
            </Typography>
          </Tooltip>
        </Stack>
        <FormControlLabel
          className={classes.checkbox}
          control={<Checkbox checked={field.required} onChange={(e) => updateField({ ...field, required: e.target.checked })} />}
          disabled={disabled}
          label='Påkrevd'
          labelPlacement='start'
        />
      </div>
      <div className={classes.row}>
        <TextField
          disabled={disabled}
          fullWidth
          label='Spørsmål'
          maxRows={3}
          multiline
          onChange={(e) => updateField({ ...field, title: e.target.value })}
          size='small'
          value={field.title}
        />
        <IconButton className={classes.deleteIcon} disabled={disabled} onClick={removeField}>
          <DeleteIcon />
        </IconButton>
      </div>
      {field.type !== FormFieldType.TEXT_ANSWER && (
        <>
          {field.options.map((option, index) => (
            <Grow in key={index} timeout={1000}>
              <div className={cx(classes.row, classes.optionRow)}>
                <TypeIcon sx={{ color: (theme) => theme.palette.text[disabled ? 'disabled' : 'primary'] }} />
                <TextField
                  disabled={disabled}
                  fullWidth
                  label='Alternativ'
                  onChange={(e) => updateFieldOption(e.target.value, index)}
                  size='small'
                  value={option.title}
                />
                {field.options.length > 1 && (
                  <IconButton disabled={disabled} onClick={() => deleteFieldOption(index)}>
                    <ClearIcon />
                  </IconButton>
                )}
              </div>
            </Grow>
          ))}
          <Button disabled={disabled} onClick={addFieldOption}>
            Legg til alternativ
          </Button>
        </>
      )}
    </Paper>
  );
};

export default FieldEditor;
