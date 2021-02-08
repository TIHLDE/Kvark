import { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import classnames from 'classnames';
import { News } from 'types/Types';
import { useNews } from 'api/hooks/News';

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
  const { getNews } = useNews();
  const [news, setNews] = useState<Array<News>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscribed = true;
    getNews().then((data) => {
      if (subscribed) {
        setNews(data);
        setIsLoading(false);
      }
    });
    return () => {
      subscribed = false;
    };
  }, [getNews]);

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
          <StoriesView isLoading={isLoading} news={news} />
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
          <NewsListView isLoading={isLoading} news={news} />
        </Container>
      </div>
    </Navigation>
  );
};

export default Landing;
