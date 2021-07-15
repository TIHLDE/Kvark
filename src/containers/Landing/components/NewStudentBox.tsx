import { useMemo } from 'react';
import { useUser, useIsAuthenticated } from 'api/hooks/User';
import { useGoogleAnalytics, usePersistedState } from 'api/hooks/Utils';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { SHOW_NEW_STUDENT_INFO } from 'constant';

// Material UI Components
import { Typography, styled, Button, Stack } from '@material-ui/core';

// Icons
import OpenIcon from '@material-ui/icons/ArrowForwardRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';
import OpenInNewIcon from '@material-ui/icons/OpenInNewRounded';

const Box = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `${theme.spacing(0.5)} solid ${theme.palette.get<string>({ light: theme.palette.common.black, dark: theme.palette.common.white })}`,
  margin: theme.spacing(0, 1, 4),
}));

const NewStudentBox = () => {
  const { event } = useGoogleAnalytics();
  const { data: user, isLoading } = useUser();
  const isAuthenticated = useIsAuthenticated();
  const [shouldShowBox, setShouldShowBox] = usePersistedState('ShowNewStudentBox', true, 1000 * 3600 * 24 * 60);
  const HEADER = {
    NEW_STUDENT: 'Nye studenter',
    OLD_STUDENT: 'Velkommen tilbake',
  };
  const TEXT = {
    NEW_STUDENT: `Hei, ${user?.first_name} 👋 Velkommen som ny student i TIHLDE! Vi gleder oss til å bli kjent med deg og håper at du vil være med på fadderuka og engasjere deg i linjeforeningen. Les alt på siden for nye studenter ⬇️`,
    OLD_STUDENT: `Hei, ${user?.first_name} 👋 Velkommen tilbake til et nytt semester! Håper du har hatt en strålende sommer og er gira på å komme i gang igjen. Husk at det er lurt å sjekke nettsiden jevnlig for nye kule arrangementer og stillingsannonser 😃`,
    NO_AUTH:
      'Velkommen til alle nye studenter i TIHLDE 👋 Vi gleder oss til å bli kjent med dere og håper at dere vil være med på fadderuka og engasjere dere i linjeforeningen. Les alt om fadderuka, verv og FAQ på siden for nye studenter ⬇️',
  };

  const header = useMemo(() => {
    if (isLoading && isAuthenticated) {
      return '';
    } else if (user?.user_class !== 1 && isAuthenticated) {
      return HEADER.OLD_STUDENT;
    } else {
      return HEADER.NEW_STUDENT;
    }
  }, [user, isAuthenticated]);

  const text = useMemo(() => {
    if (isLoading && isAuthenticated) {
      return '';
    } else if (user) {
      if (user.user_class === 1) {
        return TEXT.NEW_STUDENT;
      } else {
        return TEXT.OLD_STUDENT;
      }
    } else {
      return TEXT.NO_AUTH;
    }
  }, [user, isAuthenticated]);

  if (!SHOW_NEW_STUDENT_INFO || header === '' || !shouldShowBox) {
    return null;
  }

  const hideBox = () => {
    setShouldShowBox(false);
    event('hide-box', 'new-student', 'Hide new student box on landing page');
  };
  const fadderukaSignupAnalytics = () => event('signup-fadderuka-from-box', 'new-student', 'Clicked on link to signup for fadderuka');

  return (
    <Box>
      <Typography align='center' color='inherit' gutterBottom variant='h2'>
        {header}
      </Typography>
      <Typography align='center' gutterBottom>
        {text}
      </Typography>
      {header === HEADER.NEW_STUDENT && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
          <Button component={Link} endIcon={<OpenIcon />} fullWidth to={URLS.newStudent} variant='contained'>
            Nye studenter
          </Button>
          <Button
            component='a'
            endIcon={<OpenInNewIcon />}
            fullWidth
            href='https://s.tihlde.org/fadderuka-paamelding'
            onClick={fadderukaSignupAnalytics}
            rel='noopener noreferrer'
            target='_blank'
            variant='outlined'>
            Meld deg på fadderuka
          </Button>
        </Stack>
      )}
      {isAuthenticated && (
        <Button
          endIcon={<CloseIcon />}
          fullWidth
          onClick={hideBox}
          sx={{ mt: 1, color: (theme) => theme.palette.get<string>({ light: theme.palette.common.black, dark: theme.palette.common.white }) }}>
          Ikke vis igjen
        </Button>
      )}
    </Box>
  );
};

export default NewStudentBox;
