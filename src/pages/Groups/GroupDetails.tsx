import { createFileRoute, Link, linkOptions, Outlet } from '@tanstack/react-router';
import { authClient } from '~/api/auth';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import Page from '~/components/navigation/Page';
import { GoBackButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { getGroupQueryOptions } from '~/hooks/Group';
import { cn } from '~/lib/utils';
import { FormGroupValues } from '~/types';
import { GroupType } from '~/types/Enums';
import { CalendarRange, CircleDollarSign, CircleHelp, Info, Scale } from 'lucide-react';

import GroupAdmin from './components/GroupAdmin';
import AddFineDialog from './fines/AddFineDialog';

export const Route = createFileRoute('/_MainLayout/grupper/$slug')({
  ssr: false,
  loader: async ({ params, context }) => {
    const auth = await authClient();
    const group = await context.queryClient.ensureQueryData(getGroupQueryOptions(params.slug));

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
    { label: 'Om', link: linkOptions({ to: '/grupper/$slug', params: { slug: group.slug } }), icon: Info },
    { label: 'Arrangementer', link: linkOptions({ to: '/grupper/$slug/arrangementer', params: { slug: group.slug } }), icon: CalendarRange },
    { label: 'Bøter', link: linkOptions({ to: '/grupper/$slug/boter', params: { slug: group.slug } }), icon: CircleDollarSign, hidden: !showFinesAndLaws },
    { label: 'Lovverk', link: linkOptions({ to: '/grupper/$slug/lovverk', params: { slug: group.slug } }), icon: Scale, hidden: !showFinesAndLaws },
    { label: 'Spørreskjemaer', link: linkOptions({ to: '/grupper/$slug/sporreskjemaer', params: { slug: group.slug } }), icon: CircleHelp, hidden: !showForms },
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
            <div className='flex w-max space-x-4'>
              {tabs
                .filter((tab) => !tab.hidden)
                .map((tab) => (
                  <Link
                    {...tab.link}
                    key={tab.label}
                    activeOptions={{ exact: true }}
                    activeProps={{
                      className: 'active',
                    }}
                    className={cn(
                      'flex items-center space-x-2 p-2 text-muted-foreground',
                      '[&.active]:text-black [&.active]:dark:text-white [&.active]:border-b [&.active]:border-primary',
                    )}>
                    {tab.icon && <tab.icon className='w-5 h-5 stroke-[1.5px]' />}
                    <h1>{tab.label}</h1>
                  </Link>
                ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
          <Outlet />
        </CardContent>
      </Card>
    </Page>
  );
}
