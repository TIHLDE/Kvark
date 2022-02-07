import { Box, Collapse, List, MenuItem, Stack, TextField, Theme, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGroup, useGroupFines, useGroupFinesStatistics, useGroupUsersFines } from 'hooks/Group';
import { useUser } from 'hooks/User';

import AddFineDialog from 'pages/Groups/fines/AddFineDialog';
import FineBatchUpdateDialog from 'pages/Groups/fines/FineBatchUpdateDialog';
import FineItem from 'pages/Groups/fines/FineItem';
import { useClearCheckedFines, useFinesFilter, useSetFinesFilter } from 'pages/Groups/fines/FinesContext';
import UserFineItem from 'pages/Groups/fines/UserFineItem';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

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

  const { data: statistics } = useGroupFinesStatistics(slug || '-');
  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useGroupFines(slug || '-', finesFilter, { enabled: tab === 'all' });
  const fines = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const {
    data: userFinesData,
    isLoading: userFinesIsLoading,
    hasNextPage: userFinesHasNextPage,
    isFetching: userFinesIsFetching,
    fetchNextPage: userFinesFetchNextPage,
  } = useGroupUsersFines(slug || '-', finesFilter, { enabled: tab === 'users' });
  const userFines = useMemo(() => (userFinesData ? userFinesData.pages.map((page) => page.results).flat() : []), [userFinesData]);

  const isAdmin = (Boolean(user) && group?.fines_admin?.user_id === user?.user_id) || group?.permissions.write;

  if (!slug || !group) {
    return null;
  }

  return (
    <Stack direction={{ xs: 'column', lg: 'row-reverse' }} gap={{ xs: 2, lg: 1 }}>
      <Paper sx={{ width: { xs: '100%', lg: 250 }, p: 1, alignSelf: 'self-start' }}>
        <Typography gutterBottom variant='h3'>
          Statistikk
        </Typography>
        <Typography variant='body2'>
          Ikke godkjent: <b>{statistics?.not_approved}</b>
        </Typography>
        <Typography variant='body2'>
          Godkjent, ikke betalt: <b>{statistics?.approved_and_not_payed}</b>
        </Typography>
        <Typography variant='body2'>
          Betalt: <b>{statistics?.payed}</b>
        </Typography>
      </Paper>
      <Box sx={{ width: '100%' }}>
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
        <Stack
          gap={1}
          sx={{
            position: 'fixed',
            zIndex: 1,
            bottom: (theme) => ({ xs: theme.spacing(12), lg: theme.spacing(2) }),
            right: (theme) => theme.spacing(2),
          }}>
          {isAdmin && <FineBatchUpdateDialog groupSlug={group.slug} size={lgUp ? 'large' : 'medium'} />}
          <AddFineDialog groupSlug={group.slug} size={lgUp ? 'large' : 'medium'} />
        </Stack>
        <Collapse in={tab === 'all'} mountOnEnter>
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            {!isLoading && !fines.length && <NotFoundIndicator header='Fant ingen bøter' subtitle='Du finner kanskje bøter med en annen filtrering' />}
            <Stack component={List} gap={1}>
              {fines.map((fine) => (
                <FineItem fine={fine} groupSlug={group.slug} isAdmin={isAdmin} key={fine.id} />
              ))}
            </Stack>
          </Pagination>
        </Collapse>
        <Collapse in={tab === 'users'} mountOnEnter>
          <Pagination fullWidth hasNextPage={userFinesHasNextPage} isLoading={userFinesIsFetching} nextPage={() => userFinesFetchNextPage()}>
            {!userFinesIsLoading && !userFines.length && (
              <NotFoundIndicator header='Fant ingen bøter' subtitle='Du finner kanskje bøter med en annen filtrering' />
            )}
            <Stack component={List} gap={1}>
              {userFines.map((userFine) => (
                <UserFineItem groupSlug={group.slug} isAdmin={isAdmin} key={userFine.user.user_id} userFine={userFine} />
              ))}
            </Stack>
          </Pagination>
        </Collapse>
      </Box>
    </Stack>
  );
};

export default Fines;
