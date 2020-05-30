import React, {useState, useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// API and store imports
import NewsService from '../../api/services/NewsService';

// Material Components
import CircularProgress from '@material-ui/core/CircularProgress';
import Grow from '@material-ui/core/Grow';

// Project components
import NewsListItem from './components/NewsListItem';
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
import Pageination from '../../components/layout/Pageination';
import NoNewsIndicator from './components/NoNewsIndicator';

const styles = (theme) => ({
  root: {
    width: 'auto',
    height: 'auto',
    minHeight: '95vh',
  },
  wrapper: {
    paddingTop: 20,
    paddingBottom: 30,

    maxWidth: 1200,

    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto',
    margin: 'auto',
    gridGap: 15,
    justifyContent: 'center',

    '@media only screen and (max-width: 1200px)': {
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  listRoot: {
    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  progress: {
    display: 'block',
    margin: 'auto',
    marginTop: 10,

    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
});

const News = (props) => {
  const {classes} = props;

  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);

  // Gets the news
  const loadNews = () => {
    setIsLoading(true);
    let urlParameters = {};

    // Decide if we should go to next page or not.
    if (nextPage) {
      urlParameters = {
        page: nextPage,
        ...urlParameters,
      };
    } else if (news.length > 0) {
      // Abort if we have no more pages and already have loaded everything
      setIsLoading(false);
      return;
    }

    // Fetch news from server
    NewsService.getNews(urlParameters, (isError, loadedNews) => {
      if (isError === false) {
        let displayedNews = loadedNews;
        const nextPageUrl = loadedNews.next;
        urlParameters = {};

        // If we have a url for the next page convert it into a object
        if (nextPageUrl) {
          const nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
          const parameterArray = nextPageUrlQuery.split('&');
          parameterArray.forEach((parameter) => {
            const parameterString = parameter.split('=');
            urlParameters[parameterString[0]] = parameterString[1];
          });
        }

        // Get the page number from the object if it exist
        const nextPage = urlParameters['page'] ? urlParameters['page'] : null;

        // If we allready have news
        if (news.length > 0) {
          displayedNews = news.concat(displayedNews);
        }
        setNews(displayedNews);
        setNextPage(nextPage);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNextPage = () => {
    loadNews();
  };

  return (
    <Navigation isLoading={isLoading} footer whitesmoke fancyNavbar>
      <div className={classes.root}>
        <Banner title='Nyheter'/>
        <div className={classes.wrapper}>
          {isLoading ? <CircularProgress className={classes.progress} /> :
            <div className={classes.listRoot}>
              <Grow in={!isLoading}>
                <div className={classes.list}>
                  <Pageination nextPage={getNextPage} page={nextPage}>
                    {news && news.map((value) => (
                      <NewsListItem key={value.id} data={value} />
                    ))}
                  </Pageination>
                  {news.length === 0 && !isLoading &&
                    <NoNewsIndicator />
                  }
                </div>
              </Grow>
            </div>
          }
        </div>
      </div>
    </Navigation>
  );
};

News.propTypes = {
  classes: PropTypes.object,
};

News.defaultProps = {
  id: '-1',
};

export default (withStyles(styles)(News));
