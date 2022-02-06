import { useEffect, useState, useRef } from 'react';
import { Form, TextFormField, SelectFormField } from 'types';
import { FormFieldType } from 'types/Enums';
import { useUpdateForm, useFormSubmissions } from 'hooks/Form';
import { ClickAwayListener, Grow, Paper, Popper, Typography, MenuItem, MenuList, Button, Stack, TextField } from '@mui/material';
import FieldEditor from 'components/forms/FieldEditor';
import { useSnackbar } from 'hooks/Snackbar';

export type FormFieldsEditorProps = {
  form: Form;
  onSave?: () => void;
  canEditTitle?: boolean;
};

const FormFieldsEditor = ({ form, onSave, canEditTitle }: FormFieldsEditorProps) => {
  const { data: submissions, isLoading: isSubmissionsLoading } = useFormSubmissions(form.id, 1);
  const updateForm = useUpdateForm(form.id);
  const disabledFromSubmissions = (submissions ? Boolean(submissions.count) : true) && !isSubmissionsLoading;
  const disabled = updateForm.isLoading || isSubmissionsLoading || disabledFromSubmissions;
  const showSnackbar = useSnackbar();
  const [fields, setFields] = useState<Array<TextFormField | SelectFormField>>(form.fields);
  const [addButtonOpen, setAddButtonOpen] = useState(false);
  const buttonAnchorRef = useRef(null);
  const [formTitle, setFormTitle] = useState(form.title);

  useEffect(() => setFields(form.fields), [form]);

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
      { title: formTitle, fields: fields, resource_type: form.resource_type },
      {
        onSuccess: () => {
          showSnackbar('Spørsmålene ble oppdatert', 'success');
          if (onSave) {
            onSave();
          }
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
        {canEditTitle && <TextField label='Malen sitt navn' onChange={(e) => setFormTitle(e.target.value)} type='text' value={formTitle} />}
        {disabledFromSubmissions && (
          <Typography gutterBottom variant='body2'>
            Du kan ikke endre spørsmålene etter at noen har svart på dem
          </Typography>
        )}
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
        <Button disabled={disabled} fullWidth onClick={save} variant='contained'>
          Lagre
        </Button>
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

export default FormFieldsEditor;
