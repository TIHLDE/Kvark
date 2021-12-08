import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGroup, useGroupFines, useGroupUsersFines } from 'hooks/Group';
import { useUser } from 'hooks/User';

import { List, Stack, ToggleButton, ToggleButtonGroup, TextField, MenuItem, useMediaQuery, Theme, Collapse } from '@mui/material';

import Pagination from 'components/layout/Pagination';
import FineItem from 'pages/Groups/fines/FineItem';
import UserFineItem from 'pages/Groups/fines/UserFineItem';
import AddFineDialog from 'pages/Groups/fines/AddFineDialog';
import FineBatchUpdateDialog from 'pages/Groups/fines/FineBatchUpdateDialog';
import { useFinesFilter, useSetFinesFilter, useClearCheckedFines } from 'pages/Groups/fines/FinesContext';

const PAYED_STATES = [
  { value: true, label: 'Betalt' },
  { value: false, label: 'Ikke betalt' },
  { value: undefined, label: 'Alle' },
];

const APPROVED_STATES = [
  { value: true, label: 'Godkjent' },
  { value: false, label: 'Ikke godkjent' },
  { value: undefined, label: 'Alle' },
];

const Fines = () => {
  const { slug } = useParams<'slug'>();
  const { data: user } = useUser();
  const { data: group } = useGroup(slug || '-');
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const [tab, setTab] = useState<'all' | 'users'>('all');
  const finesFilter = useFinesFilter();
  const setFinesFilter = useSetFinesFilter();
  const clearCheckedFines = useClearCheckedFines();

  useEffect(() => clearCheckedFines(), [tab]);

  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useGroupFines(slug || '-', finesFilter, { enabled: tab === 'all' });
  const fines = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const {
    data: userFinesData,
    hasNextPage: userFinesHasNextPage,
    isFetching: userFinesIsFetching,
    fetchNextPage: userFinesFetchNextPage,
  } = useGroupUsersFines(slug || '-', finesFilter, { enabled: tab === 'users' });
  const userFines = useMemo(() => (userFinesData ? userFinesData.pages.map((page) => page.results).flat() : []), [userFinesData]);

  const isAdmin = (Boolean(user) && group?.fines_admin?.user_id === user?.user_id) || group?.permissions.write;

  if (isLoading || !slug || !group) {
    return null;
  }

  return (
    <>
      <Stack direction={{ xs: 'column', lg: 'row-reverse' }} gap={1} justifyContent='space-between'>
        <Stack direction='row' gap={1}>
          <TextField
            fullWidth
            label='Godkjent'
            onChange={({ target: { value } }) =>
              setFinesFilter((prev) => ({ ...prev, approved: value === 'true' ? true : value === 'false' ? false : undefined }))
            }
            select
            size='small'
            sx={{ minWidth: [undefined, 150] }}
            value={String(finesFilter.approved)}>
            {APPROVED_STATES.map((option) => (
              <MenuItem key={option.label} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label='Betalt'
            onChange={({ target: { value } }) =>
              setFinesFilter((prev) => ({ ...prev, payed: value === 'true' ? true : value === 'false' ? false : undefined }))
            }
            select
            size='small'
            sx={{ minWidth: [undefined, 150] }}
            value={String(finesFilter.payed)}>
            {PAYED_STATES.map((option) => (
              <MenuItem key={option.label} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <ToggleButtonGroup
          aria-label='Botoversikt'
          color='primary'
          exclusive
          fullWidth={!lgUp}
          onChange={(_, newVal: 'all' | 'users' | null) => setTab((prev) => (newVal ? newVal : prev))}
          size='small'
          value={tab}>
          <ToggleButton value='all'>Alle bøter</ToggleButton>
          <ToggleButton value='users'>Bøter per medlem</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {isAdmin && (
        <Stack
          gap={1}
          sx={{
            position: 'fixed',
            zIndex: 1,
            bottom: (theme) => ({ xs: theme.spacing(12), lg: theme.spacing(2) }),
            right: (theme) => theme.spacing(2),
          }}>
          <FineBatchUpdateDialog groupSlug={group.slug} />
          <AddFineDialog groupSlug={group.slug} />
        </Stack>
      )}
      <Collapse in={tab === 'all'} mountOnEnter>
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <Stack component={List} gap={1}>
            {fines.map((fine) => (
              <FineItem fine={fine} groupSlug={group.slug} isAdmin={isAdmin} key={fine.id} />
            ))}
          </Stack>
        </Pagination>
      </Collapse>
      <Collapse in={tab === 'users'} mountOnEnter>
        <Pagination fullWidth hasNextPage={userFinesHasNextPage} isLoading={userFinesIsFetching} nextPage={() => userFinesFetchNextPage()}>
          <Stack component={List} gap={1}>
            {userFines.map((userFine) => (
              <UserFineItem groupSlug={group.slug} isAdmin={isAdmin} key={userFine.user.user_id} userFine={userFine} />
            ))}
          </Stack>
        </Pagination>
      </Collapse>
    </>
  );
};

export default Fines;
