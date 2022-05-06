import MembersIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import WaitingIcon from '@mui/icons-material/PlaylistAddRounded';
import { MenuItem, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Group } from 'types';

import { useStudyGroups, useStudyyearGroups } from 'hooks/Group';
import { useUsers } from 'hooks/User';
import { useDebounce } from 'hooks/Utils';

import PersonListItem, { PersonListItemLoading } from 'pages/UserAdmin/components/PersonListItem';

import Select from 'components/inputs/Select';
import TextField from 'components/inputs/TextField';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import { PrimaryTopBox } from 'components/layout/TopBox';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';

type Filters = {
  study: Group['slug'] | 'all';
  studyyear: Group['slug'] | 'all';
  search: string;
};

const UserAdmin = () => {
  const membersTab = { value: 'members', label: 'Medlemmer', icon: MembersIcon };
  const waitingTab = { value: 'waiting', label: 'Ventende', icon: WaitingIcon };
  const tabs = [membersTab, waitingTab];
  const [tab, setTab] = useState(membersTab.value);

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
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useUsers({ is_TIHLDE_member: tab === membersTab.value, ...filters });
  const users = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  const membersAmount = `${data?.pages[0]?.count || '0'} medlemmer
  ${watchFilters.studyyear !== 'all' || watchFilters.study !== 'all' ? 'i' : 'totalt'}
  ${watchFilters.studyyear !== 'all' ? `${watchFilters.studyyear}-kullet` : ''}
  ${watchFilters.study !== 'all' ? studies.find((study) => study.slug === watchFilters.study)?.name : ''}`;

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: 'Brukeradmin' }}>
      <Paper sx={{ margin: '-60px auto 60px', position: 'relative' }}>
        <Typography variant='h1'>Brukeradmin</Typography>
        <Typography>{membersAmount}</Typography>
        <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
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
              <PersonListItem is_TIHLDE_member={tab === membersTab.value} key={user.user_id} user={user} />
            ))}
          </Pagination>
        )}
      </Paper>
    </Page>
  );
};

export default UserAdmin;
