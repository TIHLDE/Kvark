import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useUserBadges } from 'hooks/User';

import BadgeItem, { BadgeItemLoading } from 'pages/Badges/components/BadgeItem';

import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { PaginateButton } from 'components/ui/button';

const ProfileBadges = () => {
  const { userId } = useParams();
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useUserBadges(userId);
  const badges = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  return (
    <div>
      {!isLoading && !badges.length && <NotFoundIndicator header='Fant ingen badges' subtitle={`${userId ? 'Brukeren' : 'Du'} har ingen badges enda`} />}
      {isLoading && <BadgeItemLoading />}
      <div className='grid lg:grid-cols-2 gap-2'>
        {badges.map((badge) => (
          <BadgeItem badge={badge} key={badge.id} />
        ))}
      </div>
      {hasNextPage && <PaginateButton className='mt-4 w-full' isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
};

export default ProfileBadges;
