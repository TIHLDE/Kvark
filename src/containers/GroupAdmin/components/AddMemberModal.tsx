import { TextField, ListItemText, Button } from '@material-ui/core';
import useSnackbar from 'api/hooks/Snackbar';
import { Controller, useForm } from 'react-hook-form';
import { useUsers } from 'api/hooks/User';
import { useMemo, useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { getUserClass, getUserStudyShort } from 'utils';
import { useCreateMembership } from 'api/hooks/Membership';
import Dialog from 'components/layout/Dialog';
import SubmitButton from 'components/inputs/SubmitButton';
import AddIcon from '@material-ui/icons/Add';
import { UserList } from 'types/Types';

export type AddMemberModalProps = {
  groupSlug: string;
};

type FormData = {
  user: UserList;
};

const AddMemberModal = ({ groupSlug }: AddMemberModalProps) => {
  const { control, handleSubmit, errors } = useForm<FormData>();
  const showSnackbar = useSnackbar();
  const createMembership = useCreateMembership();
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState('');
  const filters = useMemo(() => {
    const filters: Record<string, unknown> = {};
    if (search) {
      filters.search = search;
    }
    return filters;
  }, [search]);

  const { data } = useUsers(filters);
  const options = data?.pages.map((page) => page.results);

  const onSubmit = (formData: FormData) => {
    createMembership.mutate(
      { groupSlug: groupSlug, userId: formData.user.user_id },
      {
        onSuccess: () => {
          showSnackbar('Medlem lagt til', 'success');
          setIsOpen(false);
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
  };

  return (
    <>
      <Button color='primary' fullWidth onClick={() => setIsOpen(true)} startIcon={<AddIcon />} variant='outlined'>
        Legg til medlem
      </Button>
      <Dialog onClose={() => setIsOpen(false)} open={isOpen} titleText='Legg til medlem'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name='user'
            render={({ onChange }) => (
              <Autocomplete
                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                noOptionsText={'Fant ingen medlemmer'}
                onChange={(_, user) => onChange(user)}
                options={options?.[0] || []}
                renderInput={(params) => (
                  <TextField margin='normal' {...params} label='Medlem' onChange={(e) => setSearch(e.target.value)} variant='outlined' />
                )}
                renderOption={(option) => (
                  <ListItemText
                    primary={`${option.first_name} ${option.last_name}`}
                    secondary={`${getUserClass(option.user_class)} ${getUserStudyShort(option.user_study)}`}
                  />
                )}
              />
            )}
          />
          <SubmitButton errors={errors}>Legg til medlem</SubmitButton>
        </form>
      </Dialog>
    </>
  );
};

export default AddMemberModal;
