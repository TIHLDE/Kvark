import { Grid } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useUserBadges } from 'hooks/User';

import BadgeItem, { BadgeItemLoading } from 'pages/Badges/components/BadgeItem';

import Pagination from 'components/layout/Pagination';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const ProfileBadges = () => {
  const { userId } = useParams();
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useUserBadges(userId);
  const badges = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  return (
    <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere badges' nextPage={() => fetchNextPage()}>
      <Grid container spacing={1}>
        {isLoading && (
          <>
            <Grid item md={6} xs={12}>
              <BadgeItemLoading />
            </Grid>
            <Grid item md={6} xs={12}>
              <BadgeItemLoading />
            </Grid>
          </>
        )}
        {!isLoading && !badges && <NotFoundIndicator header='Fant ingen badges' subtitle={`${userId ? 'Brukeren' : 'Du'} har ingen badges enda`} />}
        {badges.map((badge) => (
          <Grid item key={badge.id} md={6} xs={12}>
            <BadgeItem badge={badge} />
          </Grid>
        ))}
      </Grid>
    </Pagination>
  );
};

export default ProfileBadges;
