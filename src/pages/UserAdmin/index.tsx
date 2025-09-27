import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { PermissionApp } from '~/types/Enums';
import { ListChecks, ListChecksIcon, ListPlus, ListPlusIcon } from 'lucide-react';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { href, redirect } from 'react-router';

import { Route } from './+types';
import UserFilter from './components/UserFilter';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const auth = await authClientWithRedirect(request);

  if (!userHasWritePermission(auth.permissions, PermissionApp.USER)) {
    return redirect(href('/'));
  }
}

const UserAdmin = () => {
  const [isMember, setIsMember] = useQueryState('isMember', parseAsBoolean.withDefault(true));

  return (
    <Page className='max-w-6xl w-full mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Brukeradmin</CardTitle>
          <CardDescription>Her kan du se og administrere brukere.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isMember ? 'members' : 'waiting'} onValueChange={(value) => setIsMember(value === 'members')}>
            <TabsList>
              <TabsTrigger value='members'>
                <ListChecksIcon className='mr-2 size-5' />
                Medlemmer
              </TabsTrigger>
              <TabsTrigger value='waiting'>
                <ListPlusIcon className='mr-2 size-5' />
                Ventende
              </TabsTrigger>
            </TabsList>
            <TabsContent value='members'>
              <UserFilter isMember={true} />
            </TabsContent>
            <TabsContent value='waiting'>
              <UserFilter isMember={false} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Page>
  );
};

export default UserAdmin;
