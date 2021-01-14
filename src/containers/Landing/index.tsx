import Helmet from 'react-helmet';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Calendar from 'containers/Landing/components/EventsView';
import NewsListView from 'containers/Landing/components/NewsListView';
import Wave from 'containers/Landing/components/Wave';

const useStyles = makeStyles((theme) => ({
  section: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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
        <Container className={classes.section} maxWidth='lg'>
          <Typography align='center' className={classes.header} color='inherit' variant='h2'>
            Arrangementer
          </Typography>
          <Calendar />
        </Container>
      </div>
      <Container className={classes.section} maxWidth='lg'>
        <Typography align='center' className={classes.header} color='inherit' variant='h2'>
          Nyheter
        </Typography>
        <NewsListView />
      </Container>
    </Navigation>
  );
};

export default Landing;
