import { TextField, ListItemText } from '@material-ui/core';
import useSnackbar from 'api/hooks/Snackbar';
import { Controller, useForm } from 'react-hook-form';
import { useUsers } from 'api/hooks/User';
import { useMemo, useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { getUserClass, getUserStudyShort } from 'utils';
import { useCreateMembership } from 'api/hooks/Membership';
import Dialog from 'components/layout/Dialog';

type AddMemberModalProps = {
  modalIsOpen: boolean;
  handleClose: () => void;
  groupSlug: string;
};

const AddMemberModal = ({ modalIsOpen, handleClose, groupSlug }: AddMemberModalProps) => {
  const { control, handleSubmit } = useForm();
  const showSnackbar = useSnackbar();
  const createMembership = useCreateMembership();

  const [search, setSearch] = useState('');
  const filters = useMemo(() => {
    const filters: Record<string, unknown> = {};
    if (search) {
      filters.search = search;
    }
    return filters;
  }, [search]);

  const onSubmit = handleSubmit((formData) => {
    createMembership.mutate(
      { groupSlug: groupSlug, userId: formData.user.user_id },
      {
        onSuccess: () => {
          showSnackbar('Medlem lagt til', 'success');
          handleClose();
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
  });

  const { data } = useUsers(filters);

  const options = data?.pages.map((page) => page.results);

  return (
    <Dialog confirmText='Legg til medlem' onCancel={handleClose} onClose={handleClose} onConfirm={onSubmit} open={modalIsOpen} titleText='Legg til medlem'>
      <form onSubmit={onSubmit}>
        <Controller
          control={control}
          name='user'
          render={({ onChange }) => (
            <Autocomplete
              getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
              noOptionsText={'Fant ingen medlemmer'}
              onChange={(_, user) => onChange(user)}
              options={options?.[0] || []}
              renderInput={(params) => <TextField {...params} label='Medlem' onChange={(e) => setSearch(e.target.value)} variant='outlined' />}
              renderOption={(option) => (
                <ListItemText
                  primary={`${option.first_name} ${option.last_name}`}
                  secondary={`${getUserClass(option.user_class)} ${getUserStudyShort(option.user_study)}`}
                />
              )}
            />
          )}
        />
      </form>
    </Dialog>
  );
};

export default AddMemberModal;
