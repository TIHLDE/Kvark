import Helmet from 'react-helmet';
import classnames from 'classnames';
import { IS_EASTER } from 'constant';

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
import Paper from 'components/layout/Paper';

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
      <div className={classes.smoke}>
        {IS_EASTER && (
          <Container className={classes.section} maxWidth='lg'>
            <Paper>
              <Typography align='center' className={classes.header} color='inherit' variant='h2'>
                Påskejakten 2021
              </Typography>
              <Typography align='center' color='inherit' gutterBottom variant='body1'>
                Påskejakten 2021 gjør som Jesus og gjenoppstår fra de døde. Let og du skal finne! Hint: Klikk
              </Typography>
            </Paper>
          </Container>
        )}
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
