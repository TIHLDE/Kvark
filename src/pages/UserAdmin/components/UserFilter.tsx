import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useStudyGroups, useStudyyearGroups } from 'hooks/Group';
import { useUsers } from 'hooks/User';
import { useDebounce } from 'hooks/Utils';

import FormInput from 'components/inputs/Input';
import { FormSelect } from 'components/inputs/Select';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { PaginateButton } from 'components/ui/button';
import { Form } from 'components/ui/form';

import PersonListItem, { PersonListItemLoading } from './PersonListItem';

type UserFilterProps = {
  is_TIHLDE_member: boolean;
};

const formSchema = z.object({
  study: z.string().optional(),
  studyyear: z.string().optional(),
  search: z.string().optional(),
});

const UserFilter = ({ is_TIHLDE_member }: UserFilterProps) => {
  const { data: studies = [] } = useStudyGroups();
  const { data: studyyears = [] } = useStudyyearGroups();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { studyyear: 'all', study: 'all', search: '' },
  });
  const { study, studyyear, search } = form.getValues();

  const debouncedSearch = useDebounce(search, 500);
  const debuncedStudy = useDebounce(study, 500);
  const debouncedStudyyear = useDebounce(studyyear, 500);

  const filters = useMemo(
    () => ({
      study: debuncedStudy,
      studyyear: debouncedStudyyear,
      search: debouncedSearch,
    }),
    [debouncedSearch, debuncedStudy, debouncedStudyyear],
  );

  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useUsers({
    is_TIHLDE_member: is_TIHLDE_member,
    study: filters.study === 'all' ? undefined : filters.study,
    studyyear: filters.studyyear === 'all' ? undefined : filters.studyyear,
    search: filters.search === '' ? undefined : filters.search,
  });
  const users = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  const membersAmount = useMemo(
    () => `${data?.pages[0]?.count || '0'} medlemmer
    ${filters.studyyear !== 'all' || filters.study !== 'all' ? 'i' : 'totalt'}
    ${filters.studyyear !== 'all' ? `${filters.studyyear}-kullet` : ''}
    ${filters.study !== 'all' ? studies.find((study) => study.slug === filters.study)?.name : ''}`,
    [filters, data, studies],
  );

  return (
    <div className='space-y-4'>
      <p className='text-muted-foreground'>{membersAmount}</p>

      <Form {...form}>
        <form className='space-y-2 lg:space-y-0 lg:flex lg:items-center lg:space-x-2'>
          <FormSelect
            form={form}
            label='Klasser'
            name='studyyear'
            options={[{ label: 'Alle', value: 'all' }, ...studyyears.map((group) => ({ label: `Brukere som startet i ${group.name}`, value: group.slug }))]}
          />

          <FormSelect
            form={form}
            label='Studier'
            name='study'
            options={[{ label: 'Alle', value: 'all' }, ...studies.map((group) => ({ label: group.name, value: group.slug }))]}
          />

          <FormInput form={form} label='Søk' name='search' />
        </form>
      </Form>

      {isLoading && <PersonListItemLoading />}
      {!isLoading && !users.length && <NotFoundIndicator header='Fant ingen brukere' />}
      {error && <h1 className='text-center mt-4'>{error.detail}</h1>}
      {data !== undefined && (
        <div className='space-y-2'>
          {users.map((user) => (
            <PersonListItem is_TIHLDE_member={is_TIHLDE_member} key={user.user_id} user={user} />
          ))}
        </div>
      )}
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
};

export default UserFilter;
