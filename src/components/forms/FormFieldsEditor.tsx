import { useEffect, useState, useRef } from 'react';
import { Form, TextFormField, SelectFormField } from 'types';
import { FormFieldType, FormResourceType } from 'types/Enums';
import { useUpdateForm, useCreateForm, useFormSubmissions } from 'hooks/Form';
import { FormCreate, SelectFormFieldOption } from 'types/Form';
import { useSnackbar } from 'hooks/Snackbar';
import { ClickAwayListener, Grow, Paper, Popper, Typography, MenuItem, MenuList, Button, Stack, TextField } from '@mui/material';
import FieldEditor from 'components/forms/FieldEditor';
import VerifyDialog from 'components/layout/VerifyDialog';

export type FormFieldsEditorProps = {
  form: Form;
};

const removeIdsFromFields = (fields: Array<TextFormField | SelectFormField>) => {
  const newFields: Array<TextFormField | SelectFormField> = [];
  fields.forEach((field) => {
    const { id, ...restField } = field;
    const newOptions: Array<SelectFormFieldOption> = [];

    field.options.forEach((option) => {
      const { id, ...restOption } = option;
      newOptions.push(restOption as SelectFormFieldOption);
    });

    newFields.push({ ...restField, options: newOptions } as TextFormField | SelectFormField);
  });
  return newFields;
};

const FormFieldsEditor = ({ form }: FormFieldsEditorProps) => {
  const { data: submissions, isLoading: isSubmissionsLoading } = useFormSubmissions(form.id, 1);
  const updateForm = useUpdateForm(form.id);
  const createForm = useCreateForm();
  const disabledFromSubmissions = (submissions ? Boolean(submissions.count) : true) && !isSubmissionsLoading;
  const disabled = updateForm.isLoading || isSubmissionsLoading || disabledFromSubmissions;
  const showSnackbar = useSnackbar();
  const [fields, setFields] = useState<Array<TextFormField | SelectFormField>>(form.fields);
  const [addButtonOpen, setAddButtonOpen] = useState(false);
  const buttonAnchorRef = useRef(null);
  const [formtemplateName, setFormtemplateName] = useState('');

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

  const saveAsTemplate = () => {
    const formTemplate: FormCreate = {
      title: formtemplateName,
      fields: removeIdsFromFields(fields),
      resource_type: FormResourceType.FORM,
      viewer_has_answered: false,
      template: true,
    };
    createForm.mutate(formTemplate, {
      onSuccess: (data) => {
        showSnackbar(data.title + ' Malen ble lagret.', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <>
      <Stack gap={1}>
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
        <VerifyDialog
          contentText='Hvis du lagrer som mal vil du kunne bruke malen til å opprette skjemaer senere. Gi malen en passende tittel.'
          dialogChildren={
            <TextField
              disabled={disabled}
              fullWidth
              label='Tittel'
              margin='normal'
              onChange={(e) => setFormtemplateName(e.target.value)}
              size='small'
              value={formtemplateName}
            />
          }
          onConfirm={() => saveAsTemplate()}
          title='Lagre som mal'>
          Lagre som mal
        </VerifyDialog>
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
