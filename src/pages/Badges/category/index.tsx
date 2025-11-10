import { createFileRoute, Link, LinkOptions, Outlet } from '@tanstack/react-router';
import { authClientWithRedirect } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useBadgeCategory } from '~/hooks/Badge';
import { BarChart2, LucideIcon, Trophy } from 'lucide-react';

export const Route = createFileRoute('/_MainLayout/badges/kategorier/$categoryId')({
  async beforeLoad({ location }) {
    await authClientWithRedirect(location.href);
  },
  component: BadgeCategory,
});

function BadgeCategory() {
  const { categoryId } = Route.useParams();
  const { data } = useBadgeCategory(categoryId);

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
            <TabLink Icon={BarChart2} label='Ledertavle' to='/badges/kategorier/$categoryId' params={{ categoryId }} />
            <TabLink Icon={Trophy} label='Offentlige badges' to='/badges/kategorier/$categoryId/badges' params={{ categoryId }} />
          </div>
          <Outlet />
        </CardContent>
      </Card>
    </Page>
  );
}
function TabLink({ label, Icon, ...linkOpts }: LinkOptions & { label: string; Icon?: LucideIcon }) {
  return (
    <Link
      {...linkOpts}
      className={`flex items-center space-x-2 p-2 ${location.pathname === linkOpts.href ? 'text-black dark:text-white border-b border-primary' : 'text-muted-foreground'}`}>
      {Icon && <Icon className='w-5 h-5 stroke-[1.5px]' />}
      <h1>{label}</h1>
    </Link>
  );
}
