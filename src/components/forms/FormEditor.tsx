import { useEffect, useState, useRef } from 'react';
import { Form, TextFormField, SelectFormField } from 'types';
import { FormFieldType } from 'types/Enums';
import { useUpdateForm, useDeleteForm } from 'hooks/Form';
import { useSnackbar } from 'hooks/Snackbar';

// Material UI
import { makeStyles } from '@mui/styles';
import { ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, Button } from '@mui/material';

// Project components
import VerifyDialog from 'components/layout/VerifyDialog';
import FieldEditor from 'components/forms/FieldEditor';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export type FormEditorProps = {
  form: Form;
};

const FormEditor = ({ form }: FormEditorProps) => {
  const classes = useStyles();
  const updateForm = useUpdateForm(form.id || '-');
  const deleteForm = useDeleteForm(form.id || '-');
  const showSnackbar = useSnackbar();
  const [fields, setFields] = useState<Array<TextFormField | SelectFormField>>(form.fields);
  const [addButtonOpen, setAddButtonOpen] = useState(false);
  const buttonAnchorRef = useRef(null);

  useEffect(() => {
    setFields(form.fields);
  }, [form]);

  const onDeleteForm = () => {
    deleteForm.mutate(undefined, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const addField = (type: FormFieldType) => {
    type === FormFieldType.TEXT_ANSWER
      ? setFields((prev) => [
          ...prev,
          {
            title: '',
            required: false,
            type: type,
            options: [],
          },
        ])
      : setFields((prev) => [
          ...prev,
          {
            title: '',
            required: false,
            type: type,
            options: [{ title: '' }],
          },
        ]);
    setAddButtonOpen(false);
  };

  const updateField = (newField: TextFormField | SelectFormField, index: number) => {
    setFields((prev) => prev.map((field, i) => (i === index ? newField : field)));
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((field, i) => i !== index));
  };

  const save = () => {
    updateForm.mutate(
      { fields: fields, resource_type: form.resource_type },
      {
        onSuccess: () => {
          showSnackbar('Spørsmålene ble oppdatert', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
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
        <Button fullWidth onClick={() => setAddButtonOpen(true)} ref={buttonAnchorRef} variant='outlined'>
          Nytt spørsmål
        </Button>
        <Button fullWidth onClick={save} variant='contained'>
          Lagre
        </Button>
        <VerifyDialog
          closeText='Ikke slett skjemaet'
          color='error'
          confirmText='Jeg er sikker'
          contentText='Sletting av skjema kan ikke reverseres.'
          onConfirm={onDeleteForm}
          titleText='Er du sikker på at du vil slette dette skjemaet? Alle svar vil forsvinne.'>
          Slett
        </VerifyDialog>
      </div>
      <Popper anchorEl={buttonAnchorRef.current} open={addButtonOpen} role={undefined} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={() => setAddButtonOpen(false)}>
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
