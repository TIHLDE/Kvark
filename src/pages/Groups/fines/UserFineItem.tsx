import PayedIcon from '@mui/icons-material/CreditScoreRounded';
import ApprovedIcon from '@mui/icons-material/DoneOutlineRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import { Collapse, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { GroupUserFine } from 'types';

import { useBatchUpdateUserGroupFines, useGroupUserFines } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { useAnalytics } from 'hooks/Utils';

import FineItem, { FineItemProps } from 'pages/Groups/fines/FineItem';
import { useFinesFilter } from 'pages/Groups/fines/FinesContext';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';

export type UserFineItemProps = Pick<FineItemProps, 'groupSlug' | 'isAdmin'> & {
  userFine: GroupUserFine;
};

const UserFineItem = ({ userFine, groupSlug, isAdmin }: UserFineItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const { event } = useAnalytics();
  const finesFilter = useFinesFilter();
  const showSnackbar = useSnackbar();
  const updateUserFines = useBatchUpdateUserGroupFines(groupSlug, userFine.user.user_id);

  const { data, hasNextPage, isFetching, fetchNextPage } = useGroupUserFines(groupSlug, userFine.user.user_id, finesFilter, { enabled: expanded });
  const fines = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  const toggleApproved = () => {
    event('update-batch', 'fines', `Approved all fines of user`);
    updateUserFines.mutate(
      { approved: true },
      {
        onSuccess: () => showSnackbar(`Bøtene er nå markert som godkjent`, 'success'),
        onError: (e) => showSnackbar(e.detail, 'error'),
      },
    );
  };

  const togglePayed = () => {
    event('update-batch', 'fines', `Payed all fines of user`);
    updateUserFines.mutate(
      { payed: true },
      {
        onSuccess: () => showSnackbar(`Bøtene er nå markert som betalt`, 'success'),
        onError: (e) => showSnackbar(e.detail, 'error'),
      },
    );
  };
  return (
    <Paper noOverflow noPadding>
      <ListItem button dense onClick={() => setExpanded((prev) => !prev)}>
        <Avatar className='mr-4'>
          <AvatarImage alt={userFine.user.first_name} src={userFine.user.image} />
          <AvatarFallback>{userFine.user.first_name[0] + userFine.user.last_name[0]}</AvatarFallback>
        </Avatar>
        <ListItemText primary={`${userFine.user.first_name} ${userFine.user.last_name}`} />
        <Typography sx={{ fontWeight: 'bold', ml: 1, mr: 3 }} variant='h3'>
          {userFine.fines_amount}
        </Typography>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={expanded} mountOnEnter>
        <Divider />
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <Stack component={List} gap={1} sx={{ p: [1, undefined, 2] }}>
            {isAdmin && (
              <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
                <VerifyDialog
                  color='success'
                  contentText='Alle bøtene til brukeren, uavhengig av valgte filtre, vil bli merket som godkjent.'
                  onConfirm={toggleApproved}
                  startIcon={<ApprovedIcon />}>
                  Merk alle som godkjent
                </VerifyDialog>
                <VerifyDialog
                  color='success'
                  contentText='Alle bøtene til brukeren, uavhengig av valgte filtre, vil bli merket som betalt.'
                  onConfirm={togglePayed}
                  startIcon={<PayedIcon />}>
                  Merk alle som betalt
                </VerifyDialog>
              </Stack>
            )}
            {fines.map((fine) => (
              <FineItem fine={fine} fineUser={userFine.user} groupSlug={groupSlug} hideUserInfo isAdmin={isAdmin} key={fine.id} />
            ))}
          </Stack>
        </Pagination>
      </Collapse>
    </Paper>
  );
};

export default UserFineItem;
