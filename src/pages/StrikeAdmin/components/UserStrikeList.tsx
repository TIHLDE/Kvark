import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormInput from '~/components/inputs/Input';
import { FormSelect } from '~/components/inputs/Select';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { PaginateButton } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { useStudyGroups, useStudyyearGroups } from '~/hooks/Group';
import { useUsers } from '~/hooks/User';
import { useDebounce } from '~/hooks/Utils';
import UserStrikeListItem from '~/pages/StrikeAdmin/components/UserStrikeListItem';
import { PersonListItemLoading } from '~/pages/UserAdmin/components/PersonListItem';

const formSchema = z.object({
  study: z.string().optional(),
  studyyear: z.string().optional(),
  search: z.string().optional(),
});

const UserStrikeList = () => {
  const { data: studies = [] } = useStudyGroups();
  const { data: studyyears = [] } = useStudyyearGroups();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { studyyear: 'all', study: 'all', search: '' },
  });

  const watchFilters = form.watch();
  const formFilters = useMemo(
    () => ({
      studyyear: watchFilters.studyyear === 'all' ? undefined : watchFilters.studyyear,
      study: watchFilters.study === 'all' ? undefined : watchFilters.study,
      search: watchFilters.search === '' ? undefined : watchFilters.search,
    }),
    [watchFilters],
  );
  const filters = useDebounce(formFilters, 500);
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useUsers({ has_active_strikes: true, ...filters });
  const users = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);

  return (
    <div className='space-y-4'>
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
            <UserStrikeListItem key={user.user_id} user={user} />
          ))}
        </div>
      )}
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
};

export default UserStrikeList;
