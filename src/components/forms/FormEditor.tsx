import { useEffect, useState, useRef } from 'react';
import { Form, TextFormField, SelectFormField } from 'types';
import { FormFieldType } from 'types/Enums';
import { useUpdateForm, useDeleteForm, useFormSubmissions } from 'hooks/Form';
import { useSnackbar } from 'hooks/Snackbar';
import { ClickAwayListener, Grow, Paper, Popper, TextField, Typography, MenuItem, MenuList, Button, Stack } from '@mui/material';

// Project components
import VerifyDialog from 'components/layout/VerifyDialog';
import FieldEditor from 'components/forms/FieldEditor';

export type FormEditorProps = {
  form: Form;
};

const FormEditor = ({ form }: FormEditorProps) => {
  const { data: submissions } = useFormSubmissions(form.id || '-', 1);
  const disabled = Boolean(submissions?.count);
  const updateForm = useUpdateForm(form.id || '-');
  const deleteForm = useDeleteForm(form.id || '-');
  const showSnackbar = useSnackbar();
  const [title, setTitle] = useState(form.title);
  const [fields, setFields] = useState<Array<TextFormField | SelectFormField>>(form.fields);
  const [addButtonOpen, setAddButtonOpen] = useState(false);
  const buttonAnchorRef = useRef(null);

  useEffect(() => {
    setFields(form.fields);
  }, [form]);

  const onDeleteForm = () => {
    if (disabled) {
      return;
    }
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
    if (disabled) {
      return;
    }
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
    if (disabled) {
      return;
    }
    setFields((prev) => prev.map((field, i) => (i === index ? newField : field)));
  };

  const removeField = (index: number) => {
    if (disabled) {
      return;
    }
    setFields((prev) => prev.filter((field, i) => i !== index));
  };

  const save = () => {
    if (disabled) {
      return;
    }
    updateForm.mutate(
      { title: title, fields: fields, resource_type: form.resource_type },
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
      <Stack gap={1}>
        {disabled && (
          <Typography gutterBottom variant='body2'>
            Du kan ikke endre spørsmålene etter at noen har svart på dem
          </Typography>
        )}
        <TextField disabled={disabled} fullWidth label='Tittel' maxRows={3} multiline onChange={(e) => setTitle(e.target.value)} size='small' value={title} />
        {fields.map((field, index) => (
          <FieldEditor
            disabled={disabled}
            field={field}
            key={index}
            removeField={() => removeField(index)}
            updateField={(newField: TextFormField | SelectFormField) => updateField(newField, index)}
          />
        ))}
        <Button disabled={disabled} fullWidth onClick={() => setAddButtonOpen(true)} ref={buttonAnchorRef} variant='outlined'>
          Nytt spørsmål
        </Button>
        <Stack direction={{ sx: 'column', md: 'row' }}>
          <VerifyDialog color='error' contentText='Sletting av skjema kan ikke reverseres.' disabled={disabled} onConfirm={onDeleteForm}>
            Slett
          </VerifyDialog>
          <Button disabled={disabled} fullWidth onClick={save} variant='contained'>
            Lagre
          </Button>
        </Stack>
      </Stack>
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
