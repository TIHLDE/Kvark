import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { UseInfiniteQueryResult } from 'react-query';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { BadgesOverallLeaderboard, PaginationResponse, RequestResponse } from 'types';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

export type BadgesLeaderboard = {
  queryResult: UseInfiniteQueryResult<PaginationResponse<BadgesOverallLeaderboard>, RequestResponse>;
};

export const BadgesLeaderboard = ({ queryResult }: BadgesLeaderboard) => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = queryResult;
  const leaderboardEntries = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <>
      {!isLoading && !leaderboardEntries.length && <NotFoundIndicator header='Ingen har mottatt badges enda' />}
      {error && <Paper>{error.detail}</Paper>}
      {data !== undefined && (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <Stack component={List} gap={1}>
            {leaderboardEntries.map((entry, index) => (
              <ListItem component={Paper} disablePadding key={entry.user.user_id} noOverflow noPadding>
                <ListItemButton component={Link} to={`${URLS.profile}${entry.user.user_id}/`}>
                  <ListItemAvatar>
                    <Avatar>
                      <Typography variant='h3'>{index + 1}</Typography>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${entry.user.first_name} ${entry.user.last_name}`} />
                  <Typography sx={{ mr: 1 }} variant='h2'>
                    {entry.number_of_badges}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </Stack>
        </Pagination>
      )}
    </>
  );
};

export default BadgesLeaderboard;
