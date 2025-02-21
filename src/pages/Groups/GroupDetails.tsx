import API from '~/api/api';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import Page from '~/components/navigation/Page';
import { GoBackButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { ScrollArea } from '~/components/ui/scroll-area';
import { cn } from '~/lib/utils';
import type { Group } from '~/types/Group';
import { CalendarRange, CircleDollarSign, CircleHelp, Info, LucideIcon, Scale } from 'lucide-react';
import { Link, Outlet } from 'react-router';

import type { Route } from './+types/GroupDetails';

const GroupCache = new Map<string, { expire: Date; group: Group }>();

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const cache = GroupCache.get(params.slug);

  if (cache && cache.expire > new Date()) {
    return { group: cache.group };
  }

  const group = await API.getGroup(params.slug);
  GroupCache.set(params.slug, { expire: new Date(Date.now() + 1000 * 60), group });

  return {
    group,
  };
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <Page className='max-w-6xl mx-auto'>
      <Card>
        <CardHeader>
          <div className='flex items-center space-x-4'>
            <GoBackButton url='/grupper' />
            <h1 className='text-xl font-bold'>Kunne ikke finne gruppen</h1>
            <pre>{JSON.stringify(error, null, 4)}</pre>
          </div>
        </CardHeader>
      </Card>
    </Page>
  );
}

export default function GroupPage({ loaderData }: Route.ComponentProps) {
  const { group } = loaderData;

  const tabs = [
    { label: 'Om', to: `/grupper/${group.slug}`, icon: Info },
    { label: 'Arrangementer', to: `/grupper/${group.slug}/arrangementer`, icon: CalendarRange },
    // TODO: Toggle hidden when auth is done
    { label: 'Bøter', to: `/grupper/${group.slug}/boter`, icon: CircleDollarSign, hidden: false },
    { label: 'Lovverk', to: `/grupper/${group.slug}/lovverk`, icon: Scale, hidden: false },
    { label: 'Spørreskjemaer', to: `/grupper/${group.slug}/sporreskjemaer`, icon: CircleHelp, hidden: false },
  ];

  return (
    <Page className='max-w-6xl mx-auto'>
      <Card>
        <CardHeader>
          <div className='flex items-center space-x-4'>
            <GoBackButton url='/grupper' />
            <div className='flex items-center space-x-2'>
              <AspectRatioImg alt={group.image_alt ?? ''} className='h-[45px] w-[45px] md:h-[70px] md:w-[70px] rounded-md' src={group.image ?? ''} />
              <h1 className='text-3xl md:text-5xl font-bold'>{group.name}</h1>
            </div>
          </div>
          {/* TODO: Implement when auth is done */}
          {/* {hasWriteAcccess && <GroupAdmin group={data as FormGroupValues} />} */}
        </CardHeader>
        <CardContent>
          <ScrollArea className='w-full whitespace-nowrap p-0'>
            <div className='flex w-max space-x-4'>{tabs.map((tab) => !tab.hidden && <TabLink key={tab.label} {...tab} Icon={tab.icon} />)}</div>
          </ScrollArea>
          <Outlet />
        </CardContent>
      </Card>
    </Page>
  );
}

const TabLink = ({ to, label, Icon }: { to: string; label: string; Icon?: LucideIcon }) => (
  <Link
    className={cn('flex items-center space-x-2 p-2', location.pathname === to ? 'text-black dark:text-white border-b border-primary' : 'text-muted-foreground')}
    to={to}>
    {Icon && <Icon className='w-5 h-5 stroke-[1.5px]' />}
    <h1>{label}</h1>
  </Link>
);
