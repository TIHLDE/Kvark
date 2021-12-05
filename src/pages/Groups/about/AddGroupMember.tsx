import { TextField, ListItemText, Button, Autocomplete } from '@mui/material';
import { useSnackbar } from 'hooks/Snackbar';
import { Controller, useForm } from 'react-hook-form';
import { useUsers } from 'hooks/User';
import { useMemo, useState } from 'react';
import { getUserClass, getUserStudyShort } from 'utils';
import { useCreateMembership } from 'hooks/Membership';
import Dialog from 'components/layout/Dialog';
import SubmitButton from 'components/inputs/SubmitButton';
import AddIcon from '@mui/icons-material/Add';
import { UserList } from 'types';
import { useDebounce } from 'hooks/Utils';

export type AddMemberModalProps = {
  groupSlug: string;
};

type FormData = {
  user?: UserList;
};

const AddGroupMember = ({ groupSlug }: AddMemberModalProps) => {
  const { control, handleSubmit, formState } = useForm<FormData>();
  const showSnackbar = useSnackbar();
  const createMembership = useCreateMembership();
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const filters = useMemo(() => {
    const filters: Record<string, unknown> = {};
    if (debouncedSearch) {
      filters.search = debouncedSearch;
    }
    return filters;
  }, [debouncedSearch]);

  const { data } = useUsers(filters);
  const options = data?.pages.map((page) => page.results);

  const onSubmit = (formData: FormData) => {
    if (formData.user) {
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
    } else {
      showSnackbar('Du har ikke valgt et medlem', 'warning');
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} startIcon={<AddIcon />} sx={{ height: 'auto' }} variant='outlined'>
        Legg til
      </Button>
      <Dialog onClose={() => setIsOpen(false)} open={isOpen} titleText='Legg til medlem'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name='user'
            render={({ field: { onChange } }) => (
              <Autocomplete
                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                noOptionsText={'Fant ingen medlemmer'}
                onChange={(_, user) => onChange(user)}
                options={options?.[0] || []}
                renderInput={(params) => (
                  <TextField autoFocus margin='normal' {...params} label='Medlem' onChange={(e) => setSearch(e.target.value)} variant='outlined' />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <ListItemText
                      primary={`${option.first_name} ${option.last_name}`}
                      secondary={`${getUserClass(option.user_class)} ${getUserStudyShort(option.user_study)}`}
                    />
                  </li>
                )}
              />
            )}
          />
          <SubmitButton disabled={createMembership.isLoading} formState={formState}>
            Legg til medlem
          </SubmitButton>
        </form>
      </Dialog>
    </>
  );
};

export default AddGroupMember;
