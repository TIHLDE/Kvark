import classNames from 'classnames';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { useIsAuthenticated } from 'api/hooks/User';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Imgs
import http404img from 'assets/img/http404.gif';
import http404ropeImg from 'assets/img/http404rope.gif';

// Project Components
import Navigation from 'components/navigation/Navigation';

const useStyles = makeStyles((theme) => ({
  img: {
    width: '100%',
    maxHeight: '70vh',
    objectFit: 'contain',
  },
  imgPadding: {
    paddingTop: theme.spacing(3),
  },
  buttons: {
    margin: theme.spacing(2, 'auto'),
    display: 'grid',
    gridGap: theme.spacing(1),
    maxWidth: 200,
  },
}));

const Http404 = () => {
  const classes = useStyles();
  const isAuthenticated = useIsAuthenticated();

  return (
    <Navigation>
      <Helmet>
        <title>404 - TIHLDE</title>
      </Helmet>
      {!isAuthenticated ? (
        <img alt='404' className={classes.img} src={http404ropeImg} />
      ) : (
        <img alt='404' className={classNames(classes.img, classes.imgPadding)} src={http404img} />
      )}
      <Typography align='center' variant='h1'>
        Kunne ikke finne siden
      </Typography>
      <div className={classes.buttons}>
        <Button color='primary' component={Link} to={URLS.landing} variant='contained'>
          Til forsiden
        </Button>
        <Button color='primary' component={Link} to={URLS.aboutIndex} variant='outlined'>
          Rapporter til Index
        </Button>
      </div>
    </Navigation>
  );
};

export default Http404;
