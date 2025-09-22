import ThemeSettings from '~/components/miscellaneous/ThemeSettings';
import TopbarNotifications from '~/components/navigation/TopbarNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useOptionalAuth } from '~/hooks/auth';
// import { useAnalytics } from '~/hooks/Utils';
import { Bug, UserRoundIcon } from 'lucide-react';
import { createPath, createSearchParams, href, Link } from 'react-router';

import NavLink from '../ui/navlink';

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
          <Link className='bug-button' to={href('/tilbakemelding')}>
            <Bug className='dark:text-white w-[1.2rem] h-[1.2rem] stroke-[2px]' />
          </Link>
        </>
      )}
      <ThemeSettings />
      {auth?.user ? (
        <NavLink to='/profil/:userId?'>
          <Avatar>
            <AvatarImage alt={auth.user.firstName} src={auth.user.image ?? ''} />
            <AvatarFallback>
              {auth.user.firstName.charAt(0)}
              {auth.user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </NavLink>
      ) : (
        <Link
          to={createPath({
            pathname: href('/logg-inn'),
            search: createSearchParams({
              redirectTo: location.pathname,
            }).toString(),
          })}>
          <UserRoundIcon className='dark:text-white w-[1.2rem] h-[1.2rem] stroke-[1.5px]' />
        </Link>
      )}
    </div>
  );
};

export default ProfileTopbarButton;
