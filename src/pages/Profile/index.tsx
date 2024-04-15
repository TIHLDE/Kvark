import { ListItemProps, SvgIconProps } from '@mui/material';
import { BadgeIcon, CalendarDaysIcon, FileQuestionIcon, GripIcon, LogOutIcon, LucideIcon, SettingsIcon, ShieldCheckIcon, UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserAffiliation } from 'utils';

import { PermissionApp } from 'types/Enums';

import { useHavePermission, useLogout, useUser } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import Http404 from 'pages/Http404';
import ProfileAdmin from 'pages/Profile/components/ProfileAdmin';
import ProfileBadges from 'pages/Profile/components/ProfileBadges';
import ProfileEvents from 'pages/Profile/components/ProfileEvents';
import ProfileForms from 'pages/Profile/components/ProfileForms';
import ProfileGroups from 'pages/Profile/components/ProfileGroups';
import ProfileSettings from 'pages/Profile/components/ProfileSettings';
import ProfileStrikes from 'pages/Profile/components/ProfileStrikes';

import { QRButton } from 'components/miscellaneous/QRButton';
import Page from 'components/navigation/Page';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import { Separator } from 'components/ui/separator';
import { Skeleton } from 'components/ui/skeleton';

import EditBioButton from './components/BioEditor/EditBioButton';

const Profile = () => {
  const { userId } = useParams();
  const { data: user, isError } = useUser(userId);
  //legg til bio
  const { event } = useAnalytics();
  const logOut = useLogout();
  const { allowAccess: isAdmin } = useHavePermission([
    PermissionApp.EVENT,
    PermissionApp.JOBPOST,
    PermissionApp.NEWS,
    PermissionApp.USER,
    PermissionApp.STRIKE,
    PermissionApp.GROUP,
  ]);

  const logout = () => {
    event('log-out', 'profile', 'Logged out');
    logOut();
  };

  const eventTab: NavListItem = { label: 'Arrangementer', icon: CalendarDaysIcon };
  const badgesTab: NavListItem = { label: 'Badges', icon: BadgeIcon };
  const groupsTab: NavListItem = { label: 'Medlemskap', icon: UsersIcon };
  const formsTab: NavListItem = { label: 'Spørreskjemaer', icon: FileQuestionIcon, badge: user?.unanswered_evaluations_count };
  const settingsTab: NavListItem = { label: 'Innstillinger', icon: SettingsIcon };
  const adminTab: NavListItem = { label: 'Admin', icon: ShieldCheckIcon };
  const strikesTab: NavListItem = { label: 'Prikker', icon: GripIcon };
  const logoutTab: NavListItem = { label: 'Logg ut', icon: LogOutIcon, onClick: logout, iconProps: { sx: { color: (theme) => theme.palette.error.main } } };
  const tabs: Array<NavListItem> = userId
    ? [badgesTab, groupsTab]
    : [eventTab, badgesTab, groupsTab, strikesTab, formsTab, settingsTab, ...(isAdmin ? [adminTab] : [])];

  const [tab, setTab] = useState(userId ? badgesTab.label : eventTab.label);

  useEffect(() => setTab(userId ? badgesTab.label : eventTab.label), [userId]);
  useEffect(() => event('change-tab', 'profile', `Changed tab to: ${tab}`), [tab]);

  type NavListItem = ListItemProps & {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    badge?: string | number;
    iconProps?: SvgIconProps;
  };

  const NavListItem = ({ label, icon: Icon, onClick }: NavListItem) => (
    <Button className='flex justify-start text-md' onClick={onClick ? onClick : () => setTab(label)} variant={tab === label ? 'outline' : 'ghost'}>
      <Icon className='mr-2 stroke-[1.5px]' /> {label}
    </Button>
  );

  if (isError) {
    return <Http404 title='Kunne ikke finne brukeren' />;
  }

  return (
    <Page options={{ title: 'Profil', gutterTop: true }}>
      <Card className='my-4'>
        <CardContent className='p-4 space-y-4 md:flex md:justify-between md:space-x-12 md:space-y-0'>
          <div className='flex md:items-center space-x-2'>
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
                    <p className='text-sm md:text-md'>{user.bio.description}</p>
                    {user.bio.gitHub_link && (
                      <p>
                        <span className='font-semibold'>GitHub:</span>{' '}
                        <a className='underline' href={user.bio.gitHub_link} rel='noreferrer' target='_blank'>
                          {user.bio.gitHub_link}
                        </a>
                      </p>
                    )}
                    {user.bio.linkedIn_link && (
                      <p>
                        <span className='font-semibold'>LinkedIn:</span>{' '}
                        <a className='underline' href={user.bio.linkedIn_link} rel='noreferrer' target='_blank'>
                          {user.bio.linkedIn_link}
                        </a>
                      </p>
                    )}
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
      <div className='grid grid-cols-1 md:grid-cols-4 md:gap-x-4 pb-4'>
        <div className='space-y-4 col-span-1 mb-4 md:mb-0'>
          <Card>
            <CardContent className='p-0 grid grid-cols-2 md:grid-cols-1'>
              {tabs.map((tab) => (
                <NavListItem {...tab} key={tab.label} />
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
        <div className='col-span-3'>
          {tab === eventTab.label && <ProfileEvents />}
          {tab === badgesTab.label && <ProfileBadges />}
          {tab === groupsTab.label && <ProfileGroups />}
          {tab === formsTab.label && <ProfileForms />}
          {tab === strikesTab.label && <ProfileStrikes />}
          {tab === settingsTab.label && user && <ProfileSettings user={user} />}
          {tab === adminTab.label && <ProfileAdmin />}
        </div>
      </div>
    </Page>
  );
};

export default Profile;
