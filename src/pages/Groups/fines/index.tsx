import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { PaginateButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useGroup, useGroupFines, useGroupFinesStatistics, useGroupUsersFines } from '~/hooks/Group';
import { useMemberships } from '~/hooks/Membership';
import { useUser } from '~/hooks/User';
import FineItem from '~/pages/Groups/fines/FineItem';
import { useClearCheckedFines, useFinesFilter } from '~/pages/Groups/fines/FinesContext';
import UserFineItem from '~/pages/Groups/fines/UserFineItem';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

const PAYED_STATES = [
  { value: true, label: 'Betalt' },
  { value: false, label: 'Ikke betalt' },
  { value: undefined, label: 'Alle' },
];

const APPROVED_STATES = [
  { value: true, label: 'Godkjent' },
  { value: false, label: 'Ikke godkjent' },
  { value: undefined, label: 'Alle' },
];

const Fines = () => {
  const { slug } = useParams<'slug'>();
  const { data: user } = useUser();
  const { data: group } = useGroup(slug || '-');
  const { data: members } = useMemberships(slug || '-');

  const [tab, setTab] = useState<string>('all');
  const [finesFilter, setFinesFilter] = useFinesFilter();
  const clearCheckedFines = useClearCheckedFines();

  useEffect(() => clearCheckedFines(), [tab]);

  const { data: statistics } = useGroupFinesStatistics(slug || '-');
  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useGroupFines(slug || '-', finesFilter, { enabled: tab === 'all' });
  const fines = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);
  const {
    data: userFinesData,
    isLoading: userFinesIsLoading,
    hasNextPage: userFinesHasNextPage,
    isFetching: userFinesIsFetching,
    fetchNextPage: userFinesFetchNextPage,
  } = useGroupUsersFines(slug || '-', finesFilter, { enabled: tab === 'users' });
  const userFines = useMemo(() => (userFinesData ? userFinesData.pages.flatMap((page) => page.results) : []), [userFinesData]);

  const isAdmin = (Boolean(user) && group?.fines_admin?.user_id === user?.user_id) || group?.permissions.write;

  if (!slug || !group) {
    return null;
  }

  return (
    <div className='lg:flex lg:items-start lg:gap-8 space-y-8 lg:space-y-0'>
      <Card className='lg:order-2 lg:max-w-xs w-full'>
        <CardHeader>
          <CardTitle>Statistikk</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div>
            <h1 className='text-lg font-bold'>Totalt</h1>
            <p className='text-sm'>
              Ikke godkjent: <b>{statistics?.not_approved}</b>
            </p>
            <p className='text-sm'>
              Godkjent, ikke betalt: <b>{statistics?.approved_and_not_payed}</b>
            </p>
            <p className='text-sm'>
              Betalt: <b>{statistics?.payed}</b>
            </p>
          </div>

          <div>
            <h1 className='text-lg font-bold'>Snitt per medlem</h1>
            <p className='text-sm'>
              Ikke godkjent: <b>{((statistics?.not_approved || 0) / (members?.pages[0].count || 1)).toFixed(1)}</b>
            </p>
            <p className='text-sm'>
              Godkjent, ikke betalt: <b>{((statistics?.approved_and_not_payed || 0) / (members?.pages[0].count || 1)).toFixed(1)}</b>
            </p>
            <p className='text-sm'>
              Betalt: <b>{((statistics?.payed || 0) / (members?.pages[0].count || 1)).toFixed(1)}</b>
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs className='w-full space-y-6' defaultValue='all' onValueChange={setTab} value={tab}>
        <div className='space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between'>
          <TabsList>
            <TabsTrigger value='all'>Alle bøter</TabsTrigger>
            <TabsTrigger value='users'>Bøter per medlem</TabsTrigger>
          </TabsList>

          <div className='flex items-center space-x-2'>
            <Select
              defaultValue='none'
              onValueChange={(value) => setFinesFilter((prev) => ({ ...prev, approved: value === 'true' ? true : value === 'false' ? false : undefined }))}
            >
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Sorter etter' />
              </SelectTrigger>
              <SelectContent>
                {APPROVED_STATES.map((option) => (
                  <SelectItem key={option.label} value={option.value?.toString() || 'none'}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              defaultValue='false'
              onValueChange={(value) => setFinesFilter((prev) => ({ ...prev, payed: value === 'true' ? true : value === 'false' ? false : undefined }))}
            >
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Sorter etter' />
              </SelectTrigger>
              <SelectContent>
                {PAYED_STATES.map((option) => (
                  <SelectItem key={option.label} value={option.value?.toString() || 'none'}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value='all'>
          {!isLoading && !fines.length && <NotFoundIndicator header='Fant ingen bøter' subtitle='Du finner kanskje bøter med en annen filtrering' />}
          <div className='space-y-2'>
            {fines.map((fine) => (
              <FineItem fine={fine} groupSlug={group.slug} isAdmin={isAdmin} key={fine.id} />
            ))}
          </div>
          {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
        </TabsContent>
        <TabsContent value='users'>
          {!userFinesIsLoading && !userFines.length && (
            <NotFoundIndicator header='Fant ingen bøter' subtitle='Du finner kanskje bøter med en annen filtrering' />
          )}
          <div className='space-y-2'>
            {userFines.map((userFine) => (
              <UserFineItem groupSlug={group.slug} isAdmin={isAdmin} key={userFine.user.user_id} userFine={userFine} />
            ))}
          </div>
          {userFinesHasNextPage && <PaginateButton className='w-full mt-4' isLoading={userFinesIsFetching} nextPage={userFinesFetchNextPage} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Fines;
