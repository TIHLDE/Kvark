import Page from '~/components/navigation/Page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ListChecks, ListPlus } from 'lucide-react';

import UserFilter from './components/UserFilter';

const UserAdmin = () => {
  const membersTab = { value: 'members', label: 'Medlemmer', icon: ListChecks };
  const waitingTab = { value: 'waiting', label: 'Ventende', icon: ListPlus };
  const tabs = [membersTab, waitingTab];

  return (
    <Page className='max-w-6xl w-full mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Brukeradmin</CardTitle>
          <CardDescription>Her kan du se og administrere brukere.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='members'>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <tab.icon className='mr-2 h-5 w-5 stroke-[1.5px]' />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value='members'>
              <UserFilter is_TIHLDE_member={true} />
            </TabsContent>
            <TabsContent value='waiting'>
              <UserFilter is_TIHLDE_member={false} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Page>
  );
};

export default UserAdmin;
