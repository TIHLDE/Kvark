import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { useIsAuthenticated } from 'hooks/User';

// Material UI Components
import { Button, Typography, styled } from '@mui/material';

// Imgs
import http404img from 'assets/img/http404.gif';
import http404ropeImg from 'assets/img/http404rope.gif';

// Project Components
import Page from 'components/navigation/Page';

const Buttons = styled('div')(({ theme }) => ({
  margin: theme.spacing(2, 'auto'),
  display: 'grid',
  gridGap: theme.spacing(1),
  maxWidth: 200,
}));

const Img = styled('img')({
  width: '100%',
  maxHeight: '70vh',
  objectFit: 'contain',
});

const Http404 = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Page options={{ filledTopbar: true, title: '404', lightColor: 'blue', gutterTop: true }}>
      {isAuthenticated ? (
        <Img alt='404' loading='lazy' src={http404ropeImg} />
      ) : (
        <Img alt='404' loading='lazy' src={http404img} sx={{ paddingTop: (theme) => theme.spacing(3) }} />
      )}
      <Typography align='center' variant='h1'>
        Kunne ikke finne siden
      </Typography>
      <Buttons>
        <Button component={Link} to={URLS.landing} variant='contained'>
          Til forsiden
        </Button>
        <Button component={Link} to={URLS.aboutIndex} variant='outlined'>
          Rapporter til Index
        </Button>
      </Buttons>
    </Page>
  );
};

export default Http404;
