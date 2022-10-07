import { MenuItem, Stack } from '@mui/material';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Group } from 'types';

import { useStudyGroups, useStudyyearGroups } from 'hooks/Group';
import { useUsers } from 'hooks/User';
import { useDebounce } from 'hooks/Utils';

import UserStrikeListItem from 'pages/StrikeAdmin/components/UserStrikeListItem';
import { PersonListItemLoading } from 'pages/UserAdmin/components/PersonListItem';

import Select from 'components/inputs/Select';
import TextField from 'components/inputs/TextField';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

type Filters = {
  study: Group['slug'] | 'all';
  studyyear: Group['slug'] | 'all';
  search: string;
};

const UserStrikeList = () => {
  const { data: studies = [] } = useStudyGroups();
  const { data: studyyears = [] } = useStudyyearGroups();
  const { formState, control, watch, register } = useForm<Filters>({ defaultValues: { studyyear: 'all', study: 'all', search: '' } });
  const watchFilters = watch();
  const formFilters = useMemo(
    () => ({
      studyyear: watchFilters.studyyear === 'all' ? undefined : watchFilters.studyyear,
      study: watchFilters.study === 'all' ? undefined : watchFilters.study,
      search: watchFilters.search === '' ? undefined : watchFilters.search,
    }),
    [watchFilters],
  );
  const filters = useDebounce(formFilters, 500);
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useUsers({ has_active_strikes: true, ...filters });
  const users = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 0, md: 2 }}>
        <Select control={control} formState={formState} label='Klasser' name='studyyear'>
          <MenuItem value='all'>Alle</MenuItem>
          {studyyears.map((group) => (
            <MenuItem key={group.slug} value={group.slug}>
              {`Brukere som startet i ${group.name}`}
            </MenuItem>
          ))}
        </Select>
        <Select control={control} formState={formState} label='Studier' name='study'>
          <MenuItem value='all'>Alle</MenuItem>
          {studies.map((group) => (
            <MenuItem key={group.slug} value={group.slug}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
        <TextField formState={formState} label='Søk' {...register('search')} />
      </Stack>
      {isLoading && <PersonListItemLoading />}
      {!isLoading && !users.length && <NotFoundIndicator header='Fant ingen brukere' />}
      {error && <Paper>{error.detail}</Paper>}
      {data !== undefined && (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          {users.map((user) => (
            <UserStrikeListItem key={user.user_id} user={user} />
          ))}
        </Pagination>
      )}
    </>
  );
};

export default UserStrikeList;
