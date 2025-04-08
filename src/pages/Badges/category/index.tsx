import { BarChart2, type LucideIcon, Trophy } from 'lucide-react';
import { Link, Outlet, href } from 'react-router';
import Page from '~/components/navigation/Page';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useBadgeCategory } from '~/hooks/Badge';

import type { Route } from './+types';

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  return {
    categoryId: params.categoryId,
  };
}

export default function BadgeCategory({ loaderData }: Route.ComponentProps) {
  const { categoryId } = loaderData;
  const { data } = useBadgeCategory(categoryId);

  const TabLink = ({ to, label, Icon }: { to: string; label: string; Icon?: LucideIcon }) => (
    <Link
      className={`flex items-center space-x-2 p-2 ${location.pathname === to ? 'text-black dark:text-white border-b border-primary' : 'text-muted-foreground'}`}
      to={to}
    >
      {Icon && <Icon className='w-5 h-5 stroke-[1.5px]' />}
      <h1>{label}</h1>
    </Link>
  );

  return (
    <Page className='max-w-5xl mx-auto pt-40'>
      <Card>
        <CardHeader>
          <div className='flex items-center space-x-2'>
            <img alt={data?.image_alt || ''} className='w-20 h-20 rounded-md object-cover object-center' src={data?.image || ''} />
            <CardTitle>{data?.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-4'>
            <TabLink Icon={BarChart2} label='Ledertavle' to={href('/badges/kategorier/:categoryId', { categoryId })} />
            <TabLink Icon={Trophy} label='Offentlige badges' to={href('/badges/kategorier/:categoryId/badges', { categoryId })} />
          </div>
          <Outlet />
        </CardContent>
      </Card>
    </Page>
  );
}
