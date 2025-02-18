import Page from '~/components/navigation/Page';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useBadgeCategory } from '~/hooks/Badge';
import URLS from '~/URLS';
import { BarChart2, LucideIcon, Trophy } from 'lucide-react';
import { Suspense } from 'react';
import { Link, Outlet, useParams } from 'react-router';

const BadgeCategory = () => {
  const { categoryId } = useParams<'categoryId'>();
  const { data } = useBadgeCategory(categoryId || '_');
  const leaderboardTab = { to: URLS.badges.category_leaderboard(categoryId || '_'), label: 'Ledertavle', icon: BarChart2 };
  const badgesTab = { to: URLS.badges.category_badges(categoryId || '_'), label: 'Offentlige badges', icon: Trophy };
  const tabs = [leaderboardTab, badgesTab];

  const TabLink = ({ to, label, Icon }: { to: string; label: string; Icon?: LucideIcon }) => (
    <Link
      className={`flex items-center space-x-2 p-2 ${location.pathname === to ? 'text-black dark:text-white border-b border-primary' : 'text-muted-foreground'}`}
      to={to}>
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
            {tabs.map((tab, index) => (
              <TabLink key={index} {...tab} Icon={tab.icon} />
            ))}
          </div>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </CardContent>
      </Card>
    </Page>
  );
};

export default BadgeCategory;
