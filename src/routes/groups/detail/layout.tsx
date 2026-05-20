import { createFileRoute, Link, linkOptions, Outlet } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import Page from '~/components/navigation/Page';
import { GoBackButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { getGroupBySlugQuery } from '~/api/queries/groups';
import { cn } from '~/lib/utils';
import { GroupType } from '~/types/Enums';
import { CalendarRange, CircleDollarSign, CircleHelp, Info, Scale } from 'lucide-react';

// TODO: Re-add GroupAdmin when permissions are available from the API
import AddFineDialog from './components/AddFineDialog';

// TODO: Re-add auth protection — previously used authClientWithRedirect() / userHasWritePermission(PermissionApp.GROUP)
// TODO: The new API schema does not include permissions, viewer_is_member, or fines_activated on the group detail response.
//       These checks are hardcoded as false/true for now and need to be re-added when the API supports them.

export const Route = createFileRoute('/_MainLayout/grupper/$slug')({
  component: GroupPage,
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
});

function GroupPage() {
  const { slug } = Route.useParams();
  const { data: group } = useSuspenseQuery(getGroupBySlugQuery(slug));

  // TODO: Re-add these checks when the API includes permissions/membership info
  const hasWriteAccess = false;
  const isMemberOfGroup = false;
  const isFinesActive = group.finesActivated;

  const showFinesAndLaws = isFinesActive && (isMemberOfGroup || hasWriteAccess);
  const showForms = true; // TODO: Re-add auth check — previously checked isAuthenticated

  const tabs = [
    { label: 'Om', link: linkOptions({ to: '/grupper/$slug', params: { slug: group.slug } }), icon: Info },
    { label: 'Arrangementer', link: linkOptions({ to: '/grupper/$slug/arrangementer', params: { slug: group.slug } }), icon: CalendarRange },
    { label: 'Boter', link: linkOptions({ to: '/grupper/$slug/boter', params: { slug: group.slug } }), icon: CircleDollarSign, hidden: !showFinesAndLaws },
    { label: 'Lovverk', link: linkOptions({ to: '/grupper/$slug/lovverk', params: { slug: group.slug } }), icon: Scale, hidden: !showFinesAndLaws },
    {
      label: 'Sporreskjemaer',
      link: linkOptions({ to: '/grupper/$slug/sporreskjemaer', params: { slug: group.slug } }),
      icon: CircleHelp,
      hidden: !showForms,
    },
  ];

  return (
    <Page className='max-w-6xl mx-auto'>
      <Card>
        <CardHeader>
          {isMemberOfGroup && isFinesActive && <AddFineDialog groupSlug={group.slug} />}

          <div className='space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between'>
            <div className='flex items-center space-x-4'>
              <GoBackButton to={group.type === GroupType.INTERESTGROUP || group.type === GroupType.SPORTSTEAM ? '/interessegrupper' : '/grupper'} />
              <div className='flex items-center space-x-2'>
                <AspectRatioImg alt={''} className='h-[45px] w-[45px] md:h-[70px] md:w-[70px] rounded-md' src={group.imageUrl ?? ''} />
                <h1 className='text-3xl md:text-5xl font-bold'>{group.name}</h1>
              </div>
            </div>

            {/* TODO: Re-add GroupAdmin when permissions are available */}
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
