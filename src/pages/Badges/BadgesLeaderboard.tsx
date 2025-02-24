import { zodResolver } from '@hookform/resolvers/zod';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { PaginateButton } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '~/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useStudyGroups, useStudyyearGroups } from '~/hooks/Group';
import type { BadgesOverallLeaderboard, PaginationResponse, RequestResponse } from '~/types';
import URLS from '~/URLS';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { InfiniteQueryObserverResult, QueryKey, UseInfiniteQueryOptions } from 'react-query';
import { Link } from 'react-router';
import { z } from 'zod';

export type BadgesLeaderboard = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any;
  options?: UseInfiniteQueryOptions<
    PaginationResponse<BadgesOverallLeaderboard>,
    RequestResponse,
    PaginationResponse<BadgesOverallLeaderboard>,
    PaginationResponse<BadgesOverallLeaderboard>,
    QueryKey
  >;
  useHook: (
    filters?: BadgesLeaderboard['filters'],
    options?: BadgesLeaderboard['options'],
  ) => InfiniteQueryObserverResult<PaginationResponse<BadgesOverallLeaderboard>, RequestResponse>;
};

const formSchema = z.object({
  study: z.string(),
  studyyear: z.string(),
});

export const BadgesLeaderboard = ({ useHook, filters, options }: BadgesLeaderboard) => {
  const { data: studies = [] } = useStudyGroups();
  const { data: studyyears = [] } = useStudyyearGroups();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      study: 'all',
      studyyear: 'all',
    },
  });

  const watchFilters = form.watch();
  const formFilters = useMemo(
    () => ({
      studyyear: watchFilters.studyyear === 'all' ? undefined : watchFilters.studyyear,
      study: watchFilters.study === 'all' ? undefined : watchFilters.study,
    }),
    [watchFilters],
  );

  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useHook({ ...formFilters, ...filters }, { ...options });
  const leaderboardEntries = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <div className='space-y-4 py-4'>
      <Form {...form}>
        <form className='flex items-center space-x-4'>
          <FormField
            control={form.control}
            name='studyyear'
            render={({ field }) => (
              <FormItem {...field} className='w-full'>
                <FormLabel>Klasser</FormLabel>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Klasser' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='all'>Alle</SelectItem>
                    {studyyears.map((group) => (
                      <SelectItem key={group.slug} value={group.slug}>
                        {`Brukere som startet i ${group.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='study'
            render={({ field }) => (
              <FormItem {...field} className='w-full'>
                <FormLabel>Studier</FormLabel>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Studier' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='all'>Alle</SelectItem>
                    {studies.map((group) => (
                      <SelectItem key={group.slug} value={group.slug}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </form>
      </Form>

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
