import { useState, useMemo, useCallback } from 'react';
import { useUsers } from 'hooks/User';
import { UserList } from 'types';

import { useSnackbar } from 'hooks/Snackbar';
import { Registration } from 'types';

// Material-UI
import { Typography, Stack, Divider, FormControlLabel, Checkbox, Button, List, LinearProgress, Box } from '@mui/material';

// Icons
import CopyIcon from '@mui/icons-material/FileCopyOutlined';

// Project
import StrikeListItem from 'pages/StrikeAdmin/components/StrikeListItem';

// export type StrikeListProps = {};

const StrikeList = () => {
  const { data: users, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useUsers();
  const showSnackbar = useSnackbar();

  type UserListProps = {
    users: Array<UserList>;
  };

  const UserList = ({ users }: UserListProps) => {
    return (
      <>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Typography variant='caption'>Detaljer</Typography>
        </Stack>
        <List>
          {users.map((user) => (
            <StrikeListItem key={user.user_id} user={user} />
          ))}
        </List>
      </>
    );
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ textAlign: { lg: 'end' } }}></Box>
      </Stack>
      <Divider sx={{ my: 1 }} />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1 }}></Stack>
      <Stack direction='row' sx={{ justifyContent: 'space-between' }}></Stack>
      <UserList users={users} />
    </>
  );
};

export default StrikeList;
