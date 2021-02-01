import { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import classnames from 'classnames';
import { Event, News, JobPost } from 'types/Types';
import { useEvent } from 'api/hooks/Event';
import { useNews } from 'api/hooks/News';
import { useJobPost } from 'api/hooks/JobPost';

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
  const { getEvents } = useEvent();
  const { getNews } = useNews();
  const { getJobPosts } = useJobPost();
  const [jobposts, setJobposts] = useState<Array<JobPost>>([]);
  const [news, setNews] = useState<Array<News>>([]);
  const [events, setEvents] = useState<Array<Event>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscribed = true;
    Promise.all([
      getNews().then((data) => !subscribed || setNews(data)),
      getEvents().then((data) => !subscribed || setEvents(data.results)),
      getJobPosts().then((data) => !subscribed || setJobposts(data.results)),
    ]).then(() => !subscribed || setIsLoading(false));
    return () => {
      subscribed = false;
    };
  }, [getEvents, getNews]);

  return (
    <Navigation banner={<Wave />} fancyNavbar maxWidth={false}>
      <Helmet>
        <title>Forsiden - TIHLDE</title>
      </Helmet>
      <div className={classes.smoke}>
        <Container className={classnames(classes.section, classes.storiesSection)} maxWidth='lg'>
          <Typography align='center' className={classes.header} color='inherit' variant='h2'>
            Siste
          </Typography>
          <StoriesView events={events} isLoading={isLoading} jobposts={jobposts} news={news} />
        </Container>
      </div>
      <Container className={classes.section} maxWidth='lg'>
        <Typography align='center' className={classes.header} color='inherit' variant='h2'>
          Arrangementer
        </Typography>
        <EventsView events={events} isLoading={isLoading} />
      </Container>
      <div className={classes.smoke}>
        <Container className={classes.section} maxWidth='lg'>
          <Typography align='center' className={classes.header} color='inherit' variant='h2'>
            Nyheter
          </Typography>
          <NewsListView isLoading={isLoading} news={news} />
        </Container>
      </div>
    </Navigation>
  );
};

export default Landing;
