import { createFileRoute, Link, LinkOptions, linkOptions, Outlet } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { BarChart2Icon, CirclePlusIcon, LucideIcon, ShapesIcon, TrophyIcon } from 'lucide-react';
import { Suspense } from 'react';

export const Route = createFileRoute('/_MainLayout/badges/_index')({
  component: Badges,
});

const tabs = [
  {
    label: 'Ledertavle',
    icon: BarChart2Icon,
    link: linkOptions({
      to: '/badges',
    }),
  },
  {
    label: 'Offentlige badges',
    icon: TrophyIcon,
    link: linkOptions({
      to: '/badges/alle',
    }),
  },
  {
    label: 'Kategorier',
    icon: ShapesIcon,
    link: linkOptions({
      to: '/badges/kategorier',
    }),
  },
  {
    label: 'Erverv badge',
    icon: CirclePlusIcon,
    link: linkOptions({
      to: '/badges/erverv/{-$badgeId}',
    }),
  },
];

function Badges() {
  return (
    <Page className='max-w-5xl mx-auto pt-40'>
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className='w-full whitespace-nowrap p-0'>
            <div className='flex w-max space-x-4'>
              {tabs.map((tab) => (
                <TabLink key={tab.label} link={tab.link} label={tab.label} Icon={tab.icon} />
              ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>

          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </CardContent>
      </Card>
    </Page>
  );
}

function TabLink({ link, label, Icon }: { link: LinkOptions; label: string; Icon?: LucideIcon }) {
  return (
    <Link
      {...link}
      activeOptions={{ exact: true }}
      className={`flex items-center space-x-2 p-2 text-muted-foreground [&.active]:text-black dark:[&.active]:text-white! [&.active]:border-b [&.active]:border-primary`}>
      {Icon && <Icon className='w-5 h-5 stroke-[1.5px]' />}
      <h1>{label}</h1>
    </Link>
  );
}
