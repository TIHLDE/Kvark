import { Bug, UserRoundIcon } from 'lucide-react';
import Joyride, { ACTIONS, CallBackProps } from 'react-joyride';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import URLS from 'URLS';

import { useSetRedirectUrl } from 'hooks/Misc';
import { useTheme } from 'hooks/Theme';
import { useUser } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import ThemeSettings from 'components/miscellaneous/ThemeSettings';
import TopbarNotifications from 'components/navigation/TopbarNotifications';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';

const ProfileTopbarButton = () => {
  const { event } = useAnalytics();
  const { data: user } = useUser();
  const setLogInRedirectURL = useSetRedirectUrl();
  const theme = useTheme();
  const cookies = new Cookies();
  const showBugReportTutorial = !cookies.get('has-seen-bug-report') && cookies.get('TIHLDE-AccessToken');
  const analytics = (page: string) => event(`go-to-${page}`, 'topbar-profile-button', `Go to ${page}`);

  const handleJoyrideCallback = (data: CallBackProps) => {
    if (data.action === ACTIONS.CLOSE) {
      cookies.set('has-seen-bug-report', 'true');
    }
  };

  return (
    <div className='flex items-center space-x-4'>
      {showBugReportTutorial && (
        <Joyride
          callback={handleJoyrideCallback}
          disableScrolling={true}
          hideCloseButton={true}
          locale={{
            back: 'Tilbake',
            next: 'Neste',
            close: 'Lukk',
            skip: 'Hopp over',
            last: 'Ferdig',
          }}
          // @ts-expect-error work around for joyride not running on first render
          run={() => true}
          steps={[
            {
              disableBeacon: true,
              target: '.bug-button',
              content: (
                <div className='text-start pt-6 pb-4 dark:text-gray-300'>
                  <h3 className='text-lg font-semibold mb-2 dark:text-white'>Index rydder opp i bugs!</h3>
                  Det er nytt semester og vi setter inn en ekstra innsats for å bli kvitt det som er av bugs og feil på siden. Trykk her neste gang du møter på
                  et problem for å rapportere det!
                  <br /> <br /> - Index-teamet
                </div>
              ),
            },
          ]}
          styles={{
            options:
              theme.theme === 'light'
                ? {
                    primaryColor: 'rgb(29, 67, 140)',
                  }
                : {
                    backgroundColor: 'rgb(30, 41, 59)',
                    arrowColor: 'rgb(30, 41, 59)',
                    primaryColor: 'rgb(158, 192, 255)',
                    textColor: 'rgb(12, 12, 12)',
                  },
          }}
        />
      )}

      {Boolean(user) && (
        <>
          <TopbarNotifications />
          <Link className='bug-button' to={URLS.feedback}>
            <Bug className='dark:text-white w-[1.2rem] h-[1.2rem] stroke-[2px]' />
          </Link>
        </>
      )}
      <ThemeSettings />
      {user ? (
        <Link onClick={URLS.profile === location.pathname ? () => location.reload() : () => analytics('profile')} to={URLS.profile}>
          <Avatar>
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
