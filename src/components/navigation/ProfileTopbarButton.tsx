import { UserRoundIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { useSetRedirectUrl } from 'hooks/Misc';
import { useUser } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import ThemeSettings from 'components/miscellaneous/ThemeSettings';
import TopbarNotifications from 'components/navigation/TopbarNotifications';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';

const ProfileTopbarButton = () => {
  const { event } = useAnalytics();
  const { data: user } = useUser();
  const setLogInRedirectURL = useSetRedirectUrl();

  const analytics = (page: string) => event(`go-to-${page}`, 'topbar-profile-button', `Go to ${page}`);

  return (
    <div className='flex items-center space-x-2'>
      {Boolean(user) && <TopbarNotifications />}
      <ThemeSettings />
      {user ? (
        <Link onClick={URLS.profile === location.pathname ? () => location.reload() : () => analytics('profile')} to={URLS.profile}>
          <Avatar className='ml-2'>
            <AvatarImage alt={user.first_name} src={user.image} />
            <AvatarFallback>
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Link
          onClick={() => {
            setLogInRedirectURL(window.location.pathname);
            analytics('log-in');
          }}
          to={URLS.login}>
          <UserRoundIcon className='dark:text-white w-[1.2rem] h-[1.2rem] stroke-[1.5px]' />
        </Link>
      )}
    </div>
  );
};

export default ProfileTopbarButton;
