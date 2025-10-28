import { createFileRoute, redirect, useParams } from '@tanstack/react-router';
import { authClient, createLoginRedirectUrl } from '~/api/auth';
import { QRButton } from '~/components/miscellaneous/QRButton';
import Page from '~/components/navigation/Page';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { useHavePermission, useLogout, useUser } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import { cn } from '~/lib/utils';
import Http404 from '~/pages/Http404';
import ProfileAdmin from '~/pages/Profile/components/ProfileAdmin';
import ProfileBadges from '~/pages/Profile/components/ProfileBadges';
import ProfileEvents from '~/pages/Profile/components/ProfileEvents';
import ProfileForms from '~/pages/Profile/components/ProfileForms';
import ProfileGroups from '~/pages/Profile/components/ProfileGroups';
import ProfileSettings from '~/pages/Profile/components/ProfileSettings';
import ProfileStrikes from '~/pages/Profile/components/ProfileStrikes';
import { PermissionApp } from '~/types/Enums';
import { getUserAffiliation } from '~/utils';
import {
  BadgeIcon,
  CalendarDaysIcon,
  FileQuestionIcon,
  Github,
  GripIcon,
  Linkedin,
  LogOutIcon,
  LucideIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UsersIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import EditBioButton from './components/BioEditor/EditBioButton';

export const Route = createFileRoute('/_MainLayout/profil/{-$userId}')({
  async beforeLoad({ params, location }) {
    const auth = await authClient();
    // If trying to access your own profile without being logged in, redirect to login page
    if (!params.userId && !auth) {
      throw redirect(createLoginRedirectUrl(location.href));
    }
  },
  component: Profile,
});

function Profile() {
  const { userId } = useParams({ strict: false });
  const { data: user, isError } = useUser(userId);
  const { event } = useAnalytics();
  const logout = useLogout();
  const { allowAccess: isAdmin } = useHavePermission([
    PermissionApp.EVENT,
    PermissionApp.JOBPOST,
    PermissionApp.NEWS,
    PermissionApp.USER,
    PermissionApp.STRIKE,
    PermissionApp.GROUP,
  ]);

  const eventTab: NavListItem = { label: 'Arrangementer', icon: CalendarDaysIcon };
  const badgesTab: NavListItem = { label: 'Badges', icon: BadgeIcon };
  const groupsTab: NavListItem = { label: 'Medlemskap', icon: UsersIcon };
  const formsTab: NavListItem = { label: 'Spørreskjemaer', icon: FileQuestionIcon, badge: user?.unanswered_evaluations_count };
  const settingsTab: NavListItem = { label: 'Innstillinger', icon: SettingsIcon };
  const adminTab: NavListItem = { label: 'Admin', icon: ShieldCheckIcon };
  const strikesTab: NavListItem = { label: 'Prikker', icon: GripIcon };
  const logoutTab: NavListItem = { label: 'Logg ut', icon: LogOutIcon };
  const tabs: Array<NavListItem> = userId
    ? [badgesTab, groupsTab]
    : [eventTab, badgesTab, groupsTab, strikesTab, formsTab, settingsTab, ...(isAdmin ? [adminTab] : [])];

  const [tab, setTab] = useState(userId ? badgesTab.label : eventTab.label);

  useEffect(() => {
    event('change-tab', 'profile', `Changed tab to: ${tab}`);
    if (tab === logoutTab.label) logout();
  }, [tab]);

  type NavListItem = {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    badge?: string | number;
  };

  const NavListItem = ({ label, icon: Icon, onClick }: NavListItem) => (
    <Button
      className={cn('flex justify-start text-md border-none rounded-none', tab === label && 'bg-accent')}
      onClick={onClick ? onClick : () => setTab(label)}
      variant={tab === label ? 'outline' : 'ghost'}>
      <Icon className='mr-2 stroke-[1.5px] shrink-0' /> <p className='truncate ...'>{label}</p>
    </Button>
  );

  if (isError) {
    return <Http404 title='Kunne ikke finne brukeren' />;
  }

  return (
    <Page>
      <Card className='mb-4'>
        <CardContent className='p-4 space-y-4 md:flex md:justify-between md:space-x-12 md:space-y-0'>
          <div className='flex space-x-2'>
            {user && (
              <Avatar className='w-[70px] h-[70px] md:w-[140px] md:h-[140px] text-[1.8rem] md:text-[3rem]'>
                <AvatarImage alt={user.first_name} src={user.image} />
                <AvatarFallback>
                  {user.first_name[0]}
                  {user.last_name[0]}
                </AvatarFallback>
              </Avatar>
            )}
            {user && user.first_name ? (
              <div className='px-2 space-y-1 break-words'>
                <h1 className='text-2xl md:text-5xl font-semibold'>{`${user.first_name} ${user.last_name}`}</h1>
                <h1>
                  {user.user_id} | <a href={`mailto:${user.email}`}>{user.email}</a>
                </h1>
                <h1>{getUserAffiliation(user)}</h1>
                {user.bio && (
                  <div className='space-y-2'>
                    <Separator />
                    <p className='text-sm md:text-md break-all'>{user.bio.description}</p>
                    <div className='flex items-center space-x-1'>
                      {user.bio.gitHub_link && (
                        <Button asChild className='text-black dark:text-white' size='icon' variant='outline'>
                          <a className='underline' href={user.bio.gitHub_link} rel='noreferrer' target='_blank'>
                            <Github className='w-5 h-5 stroke-[1.5px]' />
                          </a>
                        </Button>
                      )}
                      {user.bio.linkedIn_link && (
                        <Button asChild className='text-black dark:text-white' size='icon' variant='outline'>
                          <a className='underline' href={user.bio.linkedIn_link} rel='noreferrer' target='_blank'>
                            <Linkedin className='w-5 h-5 stroke-[1.5px]' />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center mx-2 space-x-2'>
                <Skeleton className='w-[120px] h-[120px] rounded-full' />
                <div className='space-y-2'>
                  <Skeleton className='w-[230px] h-5' />
                  <Skeleton className='w-[170px] h-5' />
                </div>
              </div>
            )}
          </div>
          {!userId && user && (
            <div className='flex flex-col space-y-2'>
              <QRButton className='w-full md:w-auto' qrValue={user.user_id} subtitle={`${user.first_name} ${user.last_name}`}>
                Medlemsbevis
              </QRButton>
              <EditBioButton userBio={user.bio} />
            </div>
          )}
        </CardContent>
      </Card>
      <div className='grid grid-cols-1 md:grid-cols-6 md:gap-x-4 pb-4'>
        <div className='space-y-4 col-span-2 mb-4 md:mb-0'>
          <Card>
            <CardContent className='p-0 grid grid-cols-2 md:grid-cols-1'>
              {tabs.map((tab) => (
                <NavListItem key={tab.label} {...tab} />
              ))}
            </CardContent>
          </Card>
          {!userId && (
            <Card>
              <CardContent className='p-0 grid grid-cols-1'>
                <NavListItem {...logoutTab} />
              </CardContent>
            </Card>
          )}
        </div>
        <div className='col-span-4'>
          {tab === eventTab.label && <ProfileEvents />}
          {tab === badgesTab.label && <ProfileBadges userId={userId} />}
          {tab === groupsTab.label && <ProfileGroups userId={userId} />}
          {tab === formsTab.label && <ProfileForms />}
          {tab === strikesTab.label && <ProfileStrikes />}
          {tab === settingsTab.label && user && <ProfileSettings user={user} />}
          {tab === adminTab.label && <ProfileAdmin />}
        </div>
      </div>
    </Page>
  );
}

export default Profile;
