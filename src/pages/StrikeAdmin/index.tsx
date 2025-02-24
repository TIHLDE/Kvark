import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { PermissionApp } from '~/types/Enums';
import { DotSquare, Users } from 'lucide-react';
import { href, redirect } from 'react-router';

import { Route } from './+types';
import AllStrikesList from './components/AllStrikeList';
import UserStrikeList from './components/UserStrikeList';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const auth = await authClientWithRedirect(request);

  if (!userHasWritePermission(auth.permissions, PermissionApp.STRIKE)) {
    return redirect(href('/'));
  }
}

const StrikeAdmin = () => {
  const strikesTab = { value: 'strikes', label: 'Medlemmer med prikker', icon: Users };
  const allStrikesTab = { value: 'allStrikes', label: 'Alle prikker', icon: DotSquare };
  const tabs = [strikesTab, allStrikesTab];

  return (
    <Page className='max-w-6xl w-full mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Prikker admin</CardTitle>
          <CardDescription>Her kan du se og administrere prikker.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='strikes'>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <tab.icon className='mr-2 h-5 w-5 stroke-[1.5px]' />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value='strikes'>
              <UserStrikeList />
            </TabsContent>
            <TabsContent value='allStrikes'>
              <AllStrikesList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Page>
  );
};

export default StrikeAdmin;
