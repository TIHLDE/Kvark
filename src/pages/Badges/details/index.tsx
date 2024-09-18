import { parseISO } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate } from 'utils';

import { useBadge, useBadgeLeaderboard } from 'hooks/Badge';

import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { PaginateButton } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';

const BadgeDetails = () => {
  const { badgeId } = useParams<'badgeId'>();
  const { data: badge } = useBadge(badgeId || '_');
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useBadgeLeaderboard(badgeId || '_');
  const leaderboardEntries = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Page className='mx-auto max-w-5xl'>
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center space-x-2'>
            {badge?.image && <img alt={badge.title} className='object-contain w-16 h-16 md:w-20 md:h-20' src={badge.image} />}
            <CardHeader>
              <CardTitle>{badge?.title ? badge.title : 'TIHLDE Badge'}</CardTitle>
              <CardDescription>
                {badge?.description && badge?.total_completion_percentage
                  ? `${badge.description} • Ervervet av: ${badge.total_completion_percentage.toFixed(1)}%`
                  : 'Dette er et badge uten beskrivelse'}
              </CardDescription>
            </CardHeader>
          </div>
          {!isLoading && !leaderboardEntries.length && <NotFoundIndicator header='Ingen har mottatt dette badget enda' />}
          {error && <h1 className='text-center mt-4'>{error.detail}</h1>}
          {data !== undefined && (
            <div className='space-y-2'>
              <h1 className='text-xl font-bold'>Ervervet av:</h1>
              <div className='space-y-2'>
                {leaderboardEntries.map((entry, index) => (
                  <Link
                    className='w-full px-4 py-2 rounded-md border bg-card flex items-center justify-between hover:bg-border transition-all duration-150'
                    key={index}
                    to={`${URLS.profile}${entry.user.user_id}/`}>
                    <div className='flex items-center space-x-2'>
                      <Avatar>
                        <AvatarImage alt={entry.user.first_name} src={entry.user.image} />
                        <AvatarFallback>{entry.user.first_name[0] + entry.user.last_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className='text-lg font-semibold text-black dark:text-white'>
                          {entry.user.first_name} {entry.user.last_name}
                        </h2>
                        <p className='text-sm text-muted-foreground'>Mottatt: {formatDate(parseISO(entry.created_at))}</p>
                      </div>
                    </div>

                    <ArrowRight className='w-5 h-5 text-black dark:text-white' />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {hasNextPage && <PaginateButton className='mt-4 w-full' isLoading={isFetching} nextPage={fetchNextPage} />}
        </CardContent>
      </Card>
    </Page>
  );
};

export default BadgeDetails;
