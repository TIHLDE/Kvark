import { makeStyles } from 'makeStyles';
import Typography from '@mui/material/Typography';

// Project Components
import Page from 'components/navigation/Page';
import Container from 'components/layout/Container';
import EventsView from 'pages/Landing/components/EventsView';
import NewsListView from 'pages/Landing/components/NewsListView';
import StoriesView from 'pages/Landing/components/StoriesView';
import Wave from 'pages/Landing/components/Wave';
import NewStudentBox from 'pages/Landing/components/NewStudentBox';

const useStyles = makeStyles()((theme) => ({
  section: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down('lg')]: {
      paddingTop: theme.spacing(2),
    },
  },
  storiesSection: {
    [theme.breakpoints.down('lg')]: {
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
  const { classes, cx } = useStyles();

  return (
    <Page banner={<Wave />} maxWidth={false} options={{ title: 'Forsiden' }}>
      <div className={classes.smoke}>
        <Container className={cx(classes.section, classes.storiesSection)} maxWidth='lg'>
          <NewStudentBox />
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
    </Page>
  );
};

export default Landing;
