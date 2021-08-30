import { useMemo } from 'react';
import URLS from 'URLS';
import { Link } from 'react-router-dom';

// Material-UI
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project componets
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';
import { useNews } from 'api/hooks/News';
import { useGoogleAnalytics } from 'api/hooks/Utils';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridGap: theme.spacing(0, 1),
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
    },
  },
  noNewsText: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(0.5),
    textAlign: 'center',
  },
  btn: {
    padding: theme.spacing(1),
  },
}));

const NO_OF_NEWS_TO_SHOW = 2;

const NewsListView = () => {
  const { event } = useGoogleAnalytics();
  const { data, isLoading } = useNews();
  const news = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const classes = useStyles();

  const openNewsAnalytics = () => event('go-to-all-news', 'news-list-view', `Go to all news`);

  if (isLoading) {
    return (
      <div className={classes.container}>
        <ListItemLoading />
        <ListItemLoading />
      </div>
    );
  } else if (news.length) {
    return (
      <>
        <div className={classes.container}>{news.map((newsItem, index) => index < NO_OF_NEWS_TO_SHOW && <ListItem key={index} news={newsItem} />)}</div>
        <Button className={classes.btn} component={Link} fullWidth onClick={openNewsAnalytics} to={URLS.news} variant='outlined'>
          Alle nyheter
        </Button>
      </>
    );
  } else {
    return (
      <Typography align='center' className={classes.noNewsText} variant='subtitle1'>
        Fant ingen nyheter
      </Typography>
    );
  }
};

export default NewsListView;
