import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { authClient } from '~/api/auth';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import Page from '~/components/navigation/Page';
import { GoBackButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { getGroupQueryOptions } from '~/hooks/Group';
import { cn } from '~/lib/utils';
import { getQueryClient } from '~/queryClient';
import { FormGroupValues } from '~/types';
import { GroupType } from '~/types/Enums';
import { CalendarRange, CircleDollarSign, CircleHelp, Info, LucideIcon, Scale } from 'lucide-react';

import GroupAdmin from './components/GroupAdmin';
import AddFineDialog from './fines/AddFineDialog';

export const Route = createFileRoute('/_MainLayout/grupper/$slug')({
  loader: async ({ params }) => {
    const auth = await authClient();
    const group = await getQueryClient().ensureQueryData(getGroupQueryOptions(params.slug));

    return {
      group,
      hasWriteAcccess: Boolean(group.permissions.write),
      isMemberOfGroup: Boolean(group.viewer_is_member),
      isFinesActive: Boolean(group.fines_activated),
      isAuthenticated: Boolean(auth),
    };
  },
  errorComponent: ({ error }) => (
    <Page className='max-w-6xl mx-auto'>
      <Card>
        <CardHeader>
          <div className='flex items-center space-x-4'>
            <GoBackButton to='/grupper' />
            <h1 className='text-xl font-bold'>Kunne ikke finne gruppen</h1>
            <pre>{JSON.stringify(error, null, 4)}</pre>
          </div>
        </CardHeader>
      </Card>
    </Page>
  ),
  component: GroupPage,
});

function GroupPage() {
  const { group, hasWriteAcccess, isAuthenticated, isFinesActive, isMemberOfGroup } = Route.useLoaderData();

  const showFinesAndLaws = isFinesActive && (isMemberOfGroup || hasWriteAcccess);
  const showForms = isAuthenticated;

  const tabs = [
    { label: 'Om', to: `/grupper/${group.slug}`, icon: Info },
    { label: 'Arrangementer', to: `/grupper/${group.slug}/arrangementer`, icon: CalendarRange },
    { label: 'Bøter', to: `/grupper/${group.slug}/boter`, icon: CircleDollarSign, hidden: !showFinesAndLaws },
    { label: 'Lovverk', to: `/grupper/${group.slug}/lovverk`, icon: Scale, hidden: !showFinesAndLaws },
    { label: 'Spørreskjemaer', to: `/grupper/${group.slug}/sporreskjemaer`, icon: CircleHelp, hidden: !showForms },
  ];

  return (
    <Page className='max-w-6xl mx-auto'>
      <Card>
        <CardHeader>
          {isMemberOfGroup && isFinesActive && <AddFineDialog groupSlug={group.slug} />}

          <div className='space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between'>
            <div className='flex items-center space-x-4'>
              <GoBackButton to={group.type === GroupType.INTERESTGROUP ? '/interessegrupper' : '/grupper'} />
              <div className='flex items-center space-x-2'>
                <AspectRatioImg alt={group.image_alt ?? ''} className='h-[45px] w-[45px] md:h-[70px] md:w-[70px] rounded-md' src={group.image ?? ''} />
                <h1 className='text-3xl md:text-5xl font-bold'>{group.name}</h1>
              </div>
            </div>

            {hasWriteAcccess && <GroupAdmin group={group as FormGroupValues} />}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className='w-full whitespace-nowrap p-0'>
            <div className='flex w-max space-x-4'>{tabs.map((tab) => !tab.hidden && <TabLink key={tab.label} {...tab} Icon={tab.icon} />)}</div>
            <ScrollBar orientation='horizontal' />
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
