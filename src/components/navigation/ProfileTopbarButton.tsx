import { Link, linkOptions } from '@tanstack/react-router';
import ThemeSettings from '~/components/miscellaneous/ThemeSettings';
import TopbarNotifications from '~/components/navigation/TopbarNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useOptionalAuth } from '~/hooks/auth';
// import { useAnalytics } from '~/hooks/Utils';
import { Bug, UserRoundIcon } from 'lucide-react';

const ProfileTopbarButton = () => {
  const { auth } = useOptionalAuth();

  // TODO: Add analytics back
  // const { event } = useAnalytics();
  // const analytics = (page: string) => event(`go-to-${page}`, 'topbar-profile-button', `Go to ${page}`);

  return (
    <div className='flex items-center space-x-4'>
      {Boolean(auth) && (
        <>
          <TopbarNotifications />
          <Link className='bug-button' to='/tilbakemelding'>
            <Bug className='dark:text-white w-[1.2rem] h-[1.2rem] stroke-[2px]' />
          </Link>
        </>
      )}
      <ThemeSettings />
      {auth?.user ? (
        <Link to='/profil/{-$userId}'>
          <Avatar>
            <AvatarImage alt={auth.user.firstName} src={auth.user.image ?? ''} />
            <AvatarFallback>
              {auth.user.firstName.charAt(0)}
              {auth.user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Link
          {...linkOptions({
            to: '/logg-inn',
            search: {
              redirectTo: location.pathname,
            },
          })}>
          <UserRoundIcon className='dark:text-white w-[1.2rem] h-[1.2rem] stroke-[1.5px]' />
        </Link>
      )}
    </div>
  );
};

export default ProfileTopbarButton;
