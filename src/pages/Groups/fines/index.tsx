import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGroup, useGroupFines } from 'hooks/Group';
import { useUser } from 'hooks/User';

import { List, Stack, ToggleButton, ToggleButtonGroup, TextField, MenuItem, useMediaQuery, Theme, Collapse } from '@mui/material';

import Pagination from 'components/layout/Pagination';
import FineItem from 'pages/Groups/fines/FineItem';
import AddFineDialog from 'pages/Groups/fines/AddFineDialog';

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
  const [tab, setTab] = useState<'all' | 'users'>('all');
  const [approvedFilter, setApprovedFilter] = useState<boolean | undefined>(undefined);
  const [payedFilter, setPayedFilter] = useState<boolean | undefined>(false);
  const { slug } = useParams<'slug'>();
  const { data: user } = useUser();
  const { data: group } = useGroup(slug || '-');
  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useGroupFines(
    slug || '-',
    { approved: approvedFilter, payed: payedFilter },
    { enabled: tab === 'all' },
  );
  const fines = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

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
            onChange={({ target: { value } }) => setApprovedFilter(value === 'true' ? true : value === 'false' ? false : undefined)}
            select
            size='small'
            sx={{ minWidth: 150 }}
            value={String(approvedFilter)}>
            {APPROVED_STATES.map((option) => (
              <MenuItem key={option.label} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label='Betalt'
            onChange={({ target: { value } }) => setPayedFilter(value === 'true' ? true : value === 'false' ? false : undefined)}
            select
            size='small'
            sx={{ minWidth: 150 }}
            value={String(payedFilter)}>
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
      {isAdmin && <AddFineDialog groupSlug={group.slug} />}
      <Collapse in={tab === 'all'}>
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <Stack component={List} gap={1}>
            {fines.map((fine) => (
              <FineItem fine={fine} groupSlug={group.slug} isAdmin={isAdmin} key={fine.id} />
            ))}
          </Stack>
        </Pagination>
      </Collapse>
    </>
  );
};

export default Fines;
