import { useMemo } from 'react';
import { useUser, useIsAuthenticated } from 'api/hooks/User';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

// Material UI Components
import { Typography, styled, Button } from '@material-ui/core';

// Icons
import OpenIcon from '@material-ui/icons/ArrowForwardRounded';
const Box = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `${theme.spacing(0.5)} solid ${theme.palette.get<string>({ light: theme.palette.common.black, dark: theme.palette.common.white })}`,
  margin: theme.spacing(0, 1, 4),
}));

const NewStudentBox = () => {
  const { data: user, isLoading } = useUser();
  const isAuthenticated = useIsAuthenticated();
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

  return (
    <Box>
      <Typography align='center' color='inherit' gutterBottom variant='h2'>
        {header}
      </Typography>
      <Typography align='center' gutterBottom>
        {text}
      </Typography>
      {header !== 'Velkommen tilbake' && (
        <Button component={Link} endIcon={<OpenIcon />} fullWidth to={URLS.fadderuka} variant='contained'>
          Nye studenter
        </Button>
      )}
    </Box>
  );
};

export default NewStudentBox;
