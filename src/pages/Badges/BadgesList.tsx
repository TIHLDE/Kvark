import { Box } from '@mui/material';
import { useMemo } from 'react';

import { useBadges } from 'hooks/Badge';

import BadgeItem, { BadgeItemLoading } from 'pages/Badges/components/BadgeItem';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

export const BadgesList = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useBadges();
  const badges = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <>
      {isLoading && <BadgeItemLoading />}
      {!isLoading && !badges && <NotFoundIndicator header='Fant ingen offentlige badges' />}
      {error && <Paper>{error.detail}</Paper>}
      {data !== undefined && (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1, py: 1 }}>
            {badges.map((badge) => (
              <BadgeItem badge={badge} key={badge.id} />
            ))}
          </Box>
        </Pagination>
      )}
    </>
  );
};

export default BadgesList;
