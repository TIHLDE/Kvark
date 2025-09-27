import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { PaginateButton } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useStudyGroups, useStudyyearGroups } from '~/hooks/Group';
import { useUsers } from '~/hooks/User';
import { useDebounce } from '~/hooks/Utils';
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';

import PersonListItem, { PersonListItemLoading } from './PersonListItem';

type UserFilterProps = {
  isMember: boolean;
};

const UserFilter = ({ isMember }: UserFilterProps) => {
  const { data: studies = [] } = useStudyGroups();
  const { data: studyyears = [] } = useStudyyearGroups();

  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [study, setStudy] = useQueryState('study', parseAsString.withDefault('all'));
  const [studyyear, setStudyyear] = useQueryState('studyyear', parseAsString.withDefault('all'));

  const debouncedSearch = useDebounce(search, 500);

  const filters = useMemo(() => {
    return {
      search: debouncedSearch ? debouncedSearch : undefined,
      study: study === 'all' ? undefined : study,
      studyyear: studyyear === 'all' ? undefined : studyyear,
      is_TIHLDE_member: isMember,
    };
  }, [debouncedSearch, study, studyyear, isMember]);

  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useUsers(filters);
  const users = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);

  return (
    <div className='space-y-4'>
      <p className='text-muted-foreground'>{data?.pages[0]?.count ?? 0} resultater</p>

      <div className='space-y-2 lg:space-y-0 lg:flex lg:items-center lg:space-x-2'>
        <Label className='flex-1 grid gap-2'>
          Klasser
          <Select value={studyyear} onValueChange={setStudyyear}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Velg en klasse' />
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
        <Label className='flex-1 grid gap-2'>
          Studier
          <Select value={study} onValueChange={setStudy}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Velg et studie' />
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
        <Label className='flex-1 grid gap-2'>
          Søk
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Søk etter bruker' />
        </Label>
      </div>

      {isLoading && <PersonListItemLoading />}
      {!isLoading && !users.length && <NotFoundIndicator header='Fant ingen brukere' />}
      {error && <h1 className='text-center mt-4'>{error.detail}</h1>}
      {data !== undefined && (
        <div className='space-y-2'>
          {users.map((user) => (
            <PersonListItem isMember={isMember} key={user.user_id} user={user} />
          ))}
        </div>
      )}
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
};

export default UserFilter;
