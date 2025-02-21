import ThemeSettings from '~/components/miscellaneous/ThemeSettings';
import TopbarNotifications from '~/components/navigation/TopbarNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useRedirectUrl } from '~/hooks/Misc';
import { useTheme } from '~/hooks/Theme';
import { useIsAuthenticated, useUser } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import URLS from '~/URLS';
import { Bug, UserRoundIcon } from 'lucide-react';
import { useState } from 'react';
import Joyride, { ACTIONS, CallBackProps } from 'react-joyride';
import { href, Link } from 'react-router';

const TUTORIAL_STORAGE_KEY = 'has-seen-bug-report-tutorial';

const ProfileTopbarButton = () => {
  const { event } = useAnalytics();
  const { data: user } = useUser();
  const isAuthenticated = useIsAuthenticated();
  const [, setLogInRedirectURL] = useRedirectUrl();
  const theme = useTheme();
  const [showBugReportTutorial, setShowBugReportTutorial] = useState<boolean>(localStorage.getItem(TUTORIAL_STORAGE_KEY) !== 'true');
  const analytics = (page: string) => event(`go-to-${page}`, 'topbar-profile-button', `Go to ${page}`);

  const handleJoyrideCallback = (data: CallBackProps) => {
    if (data.action === ACTIONS.CLOSE) {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
      setShowBugReportTutorial(false);
    }
  };

  return (
    <div className='flex items-center space-x-4'>
      {isAuthenticated && showBugReportTutorial && (
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
          <Link className='bug-button' to={href('/tilbakemelding')}>
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
          }}
          to={URLS.login}>
          <UserRoundIcon className='dark:text-white w-[1.2rem] h-[1.2rem] stroke-[1.5px]' />
        </Link>
      )}
    </div>
  );
};

export default ProfileTopbarButton;
