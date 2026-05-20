import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { getGroupBySlugQuery, getGroupFinesQuery, getGroupMembersQuery } from '~/api/queries/groups';
import FineItem from './components/FineItem';
import { useState } from 'react';

// TODO: Re-add user check — previously used useUser() from ~/hooks/User
// TODO: Re-add fines statistics — previously used useGroupFinesStatistics from ~/hooks/Group
// TODO: Re-add user fines tab — previously used useGroupUsersFines from ~/hooks/Group
// TODO: Re-add UserFineItem when user fines query is available

export const Route = createFileRoute('/_MainLayout/grupper/$slug/boter')({
  component: Fines,
});

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

function Fines() {
  const { slug } = Route.useParams();
  const { data: group } = useSuspenseQuery(getGroupBySlugQuery(slug));
  const { data: membersData } = useQuery(getGroupMembersQuery(slug, 0));

  const [tab, setTab] = useState<string>('all');
  const [finesFilter, setFinesFilter] = useState<{ approved?: boolean; payed?: boolean }>({ payed: false });

  // TODO: Re-add fines statistics when getGroupFinesStatisticsQuery is available
  const statistics = null as { not_approved: number; approved_and_not_payed: number; payed: number } | null;

  const { data, isLoading } = useQuery({
    ...getGroupFinesQuery(slug, 0, finesFilter as never, 100),
    enabled: tab === 'all',
  });
  const fines = Array.isArray(data) ? data : [];

  // TODO: Re-add user check for fines admin — previously used useUser()
  // The new API schema does not include permissions on group detail
  const isAdmin = false;

  const membersCount = Array.isArray(membersData) ? membersData.length : 1;

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
              Ikke godkjent: <b>{statistics?.not_approved ?? '-'}</b>
            </p>
            <p className='text-sm'>
              Godkjent, ikke betalt: <b>{statistics?.approved_and_not_payed ?? '-'}</b>
            </p>
            <p className='text-sm'>
              Betalt: <b>{statistics?.payed ?? '-'}</b>
            </p>
          </div>

          <div>
            <h1 className='text-lg font-bold'>Snitt per medlem</h1>
            <p className='text-sm'>
              Ikke godkjent: <b>{((statistics?.not_approved || 0) / membersCount).toFixed(1)}</b>
            </p>
            <p className='text-sm'>
              Godkjent, ikke betalt: <b>{((statistics?.approved_and_not_payed || 0) / membersCount).toFixed(1)}</b>
            </p>
            <p className='text-sm'>
              Betalt: <b>{((statistics?.payed || 0) / membersCount).toFixed(1)}</b>
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs className='w-full space-y-6' defaultValue='all' onValueChange={setTab} value={tab}>
        <div className='space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between'>
          <TabsList>
            <TabsTrigger value='all'>Alle boter</TabsTrigger>
            <TabsTrigger value='users'>Boter per medlem</TabsTrigger>
          </TabsList>

          <div className='flex items-center space-x-2'>
            <Select
              defaultValue='none'
              onValueChange={(value) => setFinesFilter((prev) => ({ ...prev, approved: value === 'true' ? true : value === 'false' ? false : undefined }))}>
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
              onValueChange={(value) => setFinesFilter((prev) => ({ ...prev, payed: value === 'true' ? true : value === 'false' ? false : undefined }))}>
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
          {!isLoading && !fines.length && <NotFoundIndicator header='Fant ingen boter' subtitle='Du finner kanskje boter med en annen filtrering' />}
          <div className='space-y-2'>
            {fines.map((fine: { id: string }) => (
              <FineItem fine={fine as never} groupSlug={group.slug} isAdmin={isAdmin} key={fine.id} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value='users'>
          {/* TODO: Re-add user fines tab when useGroupUsersFines query is available */}
          <NotFoundIndicator header='Boter per medlem er ikke tilgjengelig enda' />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Fines;
