import React, { useState } from 'react';
import { Form, TextFormField, SelectFormField } from 'types/Types';
import { FormFieldType, FormType } from 'types/Enums';
import { useCreateForm, useUpdateForm } from 'api/hooks/Form';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';

// Project components
import FieldEditor from 'components/forms/FieldEditor';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export type FormEditorProps = {
  form: Form | null;
  onCreate?: (form: Array<TextFormField | SelectFormField>) => Promise<void>;
  onUpdate?: (form: Array<TextFormField | SelectFormField>) => Promise<void>;
};

const FormEditor = ({ form, onCreate, onUpdate }: FormEditorProps) => {
  const classes = useStyles();
  const createForm = useCreateForm();
  const updateForm = useUpdateForm(form?.id || '-');
  const showSnackbar = useSnackbar();
  const [fields, setFields] = useState<Array<TextFormField | SelectFormField>>(form?.fields || []);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const addField = (type: FormFieldType) => {
    type === FormFieldType.TEXT_ANSWER
      ? setFields((prev) => [
          ...prev,
          {
            title: '',
            required: false,
            type: type,
          },
        ])
      : setFields((prev) => [
          ...prev,
          {
            title: '',
            required: false,
            type: type,
            options: [{ text: '' }],
          },
        ]);
    setOpen(false);
  };

  const updateField = (newField: TextFormField | SelectFormField, index: number) => {
    setFields((prev) => prev.map((field, i) => (i === index ? newField : field)));
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((field, i) => i !== index));
  };

  const save = () => {
    if (form?.id) {
      onUpdate
        ? onUpdate(fields)
        : updateForm.mutate(
            { ...form, fields: fields },
            {
              onSuccess: () => {
                showSnackbar('Spørsmålene ble oppdatert', 'success');
              },
              onError: (e) => {
                showSnackbar(e.detail, 'error');
              },
            },
          );
    } else {
      onCreate
        ? onCreate(fields)
        : createForm.mutate(
            { fields: fields, type: FormType.SURVEY },
            {
              onSuccess: () => {
                showSnackbar('Spørsmålene ble oppdatert', 'success');
              },
              onError: (e) => {
                showSnackbar(e.detail, 'error');
              },
            },
          );
    }
  };

  return (
    <>
      <div className={classes.root}>
        {fields.map((field, index) => (
          <FieldEditor
            field={field}
            key={index}
            removeField={() => removeField(index)}
            updateField={(newField: TextFormField | SelectFormField) => updateField(newField, index)}
          />
        ))}
        <Button color='primary' fullWidth onClick={() => setOpen(true)} ref={anchorRef} variant='outlined'>
          Nytt spørsmål
        </Button>
        <Button color='primary' fullWidth onClick={save} variant='contained'>
          Lagre
        </Button>
      </div>
      <Popper anchorEl={anchorRef.current} open={open} role={undefined} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList id='menu-list-grow'>
                  <MenuItem onClick={() => addField(FormFieldType.TEXT_ANSWER)}>Tekstspørsmål</MenuItem>
                  <MenuItem onClick={() => addField(FormFieldType.SINGLE_SELECT)}>Flervalgsspørsmål</MenuItem>
                  <MenuItem onClick={() => addField(FormFieldType.MULTIPLE_SELECT)}>Avkrysningsspørsmål</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default FormEditor;
