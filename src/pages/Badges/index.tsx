import Page from '~/components/navigation/Page';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import useMediaQuery, { MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import URLS from '~/URLS';
import { BarChart2, CirclePlus, LucideIcon, Shapes, Trophy } from 'lucide-react';
import { Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

const Badges = () => {
  const location = useLocation();

  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  const leaderboardTab = { to: URLS.badges.index, label: 'Ledertavle', icon: BarChart2 };
  const badgesTab = { to: URLS.badges.public_badges(), label: 'Offentlige badges', icon: Trophy };
  const categoriesTab = { to: URLS.badges.categories(), label: 'Kategorier', icon: Shapes };
  const getTab = { to: URLS.badges.get_badge(), label: 'Erverv badge', icon: CirclePlus };
  const tabs = [leaderboardTab, badgesTab, categoriesTab, getTab];

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
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {!isDesktop && (
            <ScrollArea className='w-full whitespace-nowrap p-0'>
              <div className='flex w-max space-x-4'>
                {tabs.map((tab, index) => (
                  <TabLink key={index} {...tab} Icon={tab.icon} />
                ))}
              </div>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          )}

          {isDesktop && (
            <div className='flex items-center space-x-4'>
              {tabs.map((tab, index) => (
                <TabLink key={index} {...tab} Icon={tab.icon} />
              ))}
            </div>
          )}

          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </CardContent>
      </Card>
    </Page>
  );
};

export default Badges;
