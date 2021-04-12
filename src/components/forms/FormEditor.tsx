import { useEffect, useState, useRef } from 'react';
import { Form, TextFormField, SelectFormField } from 'types/Types';
import { FormFieldType } from 'types/Enums';
import { useUpdateForm, useDeleteForm } from 'api/hooks/Form';
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
import Dialog from 'components/layout/Dialog';
import FieldEditor from 'components/forms/FieldEditor';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  delete: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.light,
    },
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    setFields(form.fields);
  }, [form]);

  const onDeleteForm = () => {
    deleteForm.mutate(undefined, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        setDeleteDialogOpen(false);
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
        <Button color='primary' fullWidth onClick={() => setAddButtonOpen(true)} ref={anchorRef} variant='outlined'>
          Nytt spørsmål
        </Button>
        <Button color='primary' fullWidth onClick={save} variant='contained'>
          Lagre
        </Button>
        <Button className={classes.delete} fullWidth onClick={() => setDeleteDialogOpen(true)} variant='outlined'>
          Slett skjema
        </Button>
      </div>
      <Popper anchorEl={anchorRef.current} open={addButtonOpen} role={undefined} transition>
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
      <Dialog confirmText='Jeg er sikker' onClose={() => setDeleteDialogOpen(false)} onConfirm={onDeleteForm} open={deleteDialogOpen} titleText='Slett skjema'>
        Er du sikker på at du vil slette dette skjemaet? Alle svar vil forsvinne.
      </Dialog>
    </>
  );
};

export default FormEditor;
