import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import URLS from '../../../URLS';
import moment from 'moment';

// API and store imports
import NewsService from '../../../api/services/NewsService';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Project componets
import LinkButton from '../../../components/navigation/LinkButton';
import NewsListItem from '../../News/components/NewsListItem';

// Styles
const styles = (theme) => ({
  newsListContainer: {
    display: 'grid',
    gridGap: 1,
    color: theme.palette.text.secondary,
    margin: 'auto',
  },
  noEventText: {
    padding: 5,
    textAlign: 'center',
  },
  text: {
    padding: 0,
  },
  progress: {
    margin: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  moreBtn: {
    boxShadow: '0px 2px 4px ' + theme.colors.border.main + '88, 0px 0px 4px ' + theme.colors.border.main + '88',
    borderRadius: theme.sizes.border.radius,
    overflow: 'hidden',
  },
});

function NewsListView(props) {
  const {classes} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [newsToDisplay, setNewsToDisplay] = useState(1);
  const today = new Date();
  today.setDate(today.getDate() - 7);
  const lastWeek = moment(today, ['YYYY-MM-DD HH:mm:ss'], 'nb');

  // Gets the news
  const loadNews = () => {
    setIsLoading(true);

    // Fetch news from server
    NewsService.getNews({}, (isError, loadedNews) => {
      if (isError === false) {
        // Calculate how many news to show based on created news last 7 days. Minimum 1 and max 3
        const freshNews = loadedNews.filter((n) => moment(n.created_at, ['YYYY-MM-DD HH:mm:ss'], 'nb') > lastWeek);
        setNewsToDisplay(Math.min(Math.max(parseInt(freshNews.length), 1), 3));
        setNews(loadedNews);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let newsList = <div className={classes.noEventText}><CircularProgress className={classes.progress}/></div>;
  if (!isLoading) {
    newsList = news && news.length > 0 ?
        <React.Fragment>
          {news.map((newsData, index) => {
            if (index < newsToDisplay) {
              return (<NewsListItem key={index} data={newsData} />);
            }
            return ('');
          })}
          <div className={classes.moreBtn}>
            <LinkButton noPadding to={URLS.news}>
              <Typography align='center'>Alle nyheter</Typography>
            </LinkButton>
          </div>
        </React.Fragment> :
        <Typography
          variant='subtitle1'
          className={classes.noEventText}
          align='center'>Ingen nyheter å vise</Typography>;
  }

  return (
    <div className={classes.newsListContainer}>
      {newsList}
    </div>
  );
}

NewsListView.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

export default withStyles(styles)(NewsListView);
