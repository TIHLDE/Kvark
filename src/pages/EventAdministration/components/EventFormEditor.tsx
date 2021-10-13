import { useState, useRef } from 'react';
import { EventFormCreate, Form } from 'types';
import { useFormById, useCreateForm, useFormSubmissions, useFormTemplates } from 'hooks/Form';

// Material UI
import { Typography, Button, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from '@mui/material';

// Project components
import FormEditor from 'components/forms/FormEditor';
import { FormType, FormResourceType } from 'types/Enums';
import { Box } from '@mui/system';

export type EventFormEditorProps = {
  eventId: number;
  formId: string | null;
  formType: FormType;
};

const EventFormEditor = ({ eventId, formId, formType }: EventFormEditorProps) => {
  const { data, isLoading } = useFormById(formId || '-');
  const { data: submissions } = useFormSubmissions(formId || '-', 1);
  const createForm = useCreateForm();
  const [addButtonOpen, setAddButtonOpen] = useState(false);
  const buttonAnchorRef = useRef(null);
  const { data: formTemplates = [] } = useFormTemplates();
  const newForm: EventFormCreate = {
    title: String(eventId),
    type: formType,
    event: eventId,
    resource_type: FormResourceType.EVENT_FORM,
    fields: [],
  };

  const onCreate = async (formTemplate: Form | EventFormCreate) => createForm.mutate(formTemplate);

  if (!formId) {
    return (
      <Box>
        <Button fullWidth onClick={() => setAddButtonOpen(true)} ref={buttonAnchorRef} variant='outlined'>
          Opprett skjema
        </Button>
        <Popper anchorEl={buttonAnchorRef.current} open={addButtonOpen} role={undefined} transition>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <ClickAwayListener onClickAway={() => setAddButtonOpen(false)}>
                  <MenuList id='menu-list-grow'>
                    <MenuItem divider={true} onClick={() => onCreate(newForm)}>
                      Tomt skjema
                    </MenuItem>
                    {formTemplates &&
                      formTemplates.map((formTemplate) => (
                        <MenuItem key={formTemplate.id} onClick={() => onCreate(formTemplate)}>
                          {formTemplate.type}
                        </MenuItem>
                      ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    );
  } else if (isLoading || !data || !submissions) {
    return <Typography variant='body2'>Laster skjemaet</Typography>;
  } else if (submissions.count) {
    return <Typography variant='body2'>Du kan ikke endre spørsmålene etter at noen har svart på dem</Typography>;
  }

  return <FormEditor form={data} />;
};

export default EventFormEditor;
