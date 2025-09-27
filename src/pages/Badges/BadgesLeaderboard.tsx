import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { PaginateButton } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useBadgesOverallLeaderboard } from '~/hooks/Badge';
import { useStudyGroups, useStudyyearGroups } from '~/hooks/Group';
import URLS from '~/URLS';
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { Link } from 'react-router';

export type BadgesLeaderboard = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any;
};

export const BadgesLeaderboard = ({ filters }: BadgesLeaderboard) => {
  const { data: studies = [] } = useStudyGroups();
  const { data: studyyears = [] } = useStudyyearGroups();

  const [study, setStudy] = useQueryState('study', parseAsString.withDefault('all'));
  const [studyyear, setStudyyear] = useQueryState('studyyear', parseAsString.withDefault('all'));

  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useBadgesOverallLeaderboard({
    study: study === 'all' ? undefined : study,
    studyyear: studyyear === 'all' ? undefined : studyyear,
    ...filters,
  });

  const leaderboardEntries = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <div className='space-y-4 py-4'>
      <div className='grid grid-cols-2 gap-4 items-center w-full'>
        <Label>
          Klasser
          <Select value={studyyear} onValueChange={setStudyyear}>
            <SelectTrigger>
              <SelectValue placeholder='Studie år' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Alle</SelectItem>
              {studyyears.map((v) => (
                <SelectItem key={v.slug} value={v.slug}>
                  Brukere som startet i {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
        <Label>
          Studier
          <Select value={study} onValueChange={setStudy}>
            <SelectTrigger>
              <SelectValue placeholder='Studier' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Alle</SelectItem>
              {studies.map((v) => (
                <SelectItem key={v.slug} value={v.slug}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
      </div>

      <div>
        {!isLoading && !leaderboardEntries.length && <NotFoundIndicator header='Ingen har mottatt badges enda' />}
        {error && <h1 className='text-center mt-4'>{error.detail}</h1>}
        {data !== undefined && (
          <div className='space-y-4'>
            {leaderboardEntries.map((entry, index) => (
              <Link
                className='flex items-center justify-between space-x-4 p-2 border hover:bg-muted rounded-lg w-full text-black dark:text-white'
                key={index}
                to={`${URLS.profile}${entry.user.user_id}/`}>
                <div className='flex items-center space-x-2'>
                  <Avatar>
                    <AvatarImage alt={entry.user.first_name} src={entry.user.image} />
                    <AvatarFallback>{entry.user.first_name[0] + entry.user.last_name[0]}</AvatarFallback>
                  </Avatar>
                  <h1>
                    {entry.user.first_name} {entry.user.last_name}
                  </h1>
                </div>

                <h1 className='text-3xl font-bold pr-8'>{entry.number_of_badges}</h1>
              </Link>
            ))}
          </div>
        )}
        {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
      </div>
    </div>
  );
};

export default BadgesLeaderboard;
