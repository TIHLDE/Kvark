import Helmet from 'react-helmet';
import classnames from 'classnames';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Container from 'components/layout/Container';
import EventsView from 'containers/Landing/components/EventsView';
import NewsListView from 'containers/Landing/components/NewsListView';
import StoriesView from 'containers/Landing/components/StoriesView';
import Wave from 'containers/Landing/components/Wave';
import BadgeInput from 'components/miscellaneous/BadgeInput';
import { getCookie } from 'api/cookie';
import ReactAudioPlayer from 'react-audio-player';

const useStyles = makeStyles((theme) => ({
  section: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(2),
    },
  },
  storiesSection: {
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  smoke: {
    backgroundColor: theme.palette.background.smoke,
  },
  header: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
  },
}));

const Landing = () => {
  const classes = useStyles();

  return (
    <Navigation banner={<Wave />} fancyNavbar maxWidth={false}>
      <Helmet>
        <title>Forsiden - TIHLDE</title>
      </Helmet>
      {/* TODO: style component */}
      <div>
        <BadgeInput />
        {/* TODO: static sound */}
        {getCookie('theme-cookie') === 'ctf' && (
          <ReactAudioPlayer
            autoPlay
            id='rip_for_headphone_users'
            src={'https://drive.tihlde.org/index.php/s/6fFnjRCJYytCgbR/download'}
            title='rip_for_headphone_users'
          />
        )}
      </div>
      <div className={classes.smoke}>
        <Container className={classnames(classes.section, classes.storiesSection)} maxWidth='lg'>
          <Typography align='center' className={classes.header} color='inherit' variant='h2'>
            Siste
          </Typography>
          <StoriesView />
        </Container>
      </div>
      <Container className={classes.section} maxWidth='lg'>
        <Typography align='center' className={classes.header} color='inherit' variant='h2'>
          Arrangementer
        </Typography>
        <EventsView />
      </Container>
      <div className={classes.smoke}>
        <Container className={classes.section} maxWidth='lg'>
          <Typography align='center' className={classes.header} color='inherit' variant='h2'>
            Nyheter
          </Typography>
          <NewsListView />
        </Container>
      </div>
    </Navigation>
  );
};

export default Landing;
