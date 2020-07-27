import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// API and store imports
import {useNews} from '../../api/hooks/News';

// Material Components
import {withStyles} from '@material-ui/core/styles';
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

  const [urlParameters, setUrlParameters] = useState({});
  const [news, isLoading, isError] = useNews(urlParameters);
  const [displayedNews, setDisplayedNews] = useState([]);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    if (news && !isLoading && !isError) {
      const nextPageUrl = news?.next;
      if (nextPageUrl) {
        const nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
        const parameterArray = nextPageUrlQuery.split('&');
        parameterArray.forEach((parameter) => {
          const parameterString = parameter.split('=');
          setUrlParameters((params) => {
            return {...params, [parameterString[0]]: parameterString[1]};
          });
        });
      }

      // Get the page number from the object if it exist
      const nextPage = urlParameters['page'] ? urlParameters['page'] : null;

      // If we allready have news
      if (news.length > 0) {
        setDisplayedNews((d) => [...news, ...d]);
      } else {
        setDisplayedNews(news);
      }
      setNextPage(nextPage);
    } else {
      setDisplayedNews([]);
    }
  }, [news, isLoading, isError, urlParameters]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getNextPage = () => {
    if (nextPage) {
      setUrlParameters({
        page: nextPage,
        ...urlParameters,
      });
    }
  };

  return (
    <Navigation isLoading={isLoading} footer whitesmoke fancyNavbar>
      <Helmet>
        <title>Nyheter - TIHLDE</title>
      </Helmet>
      <div className={classes.root}>
        <Banner title='Nyheter'/>
        <div className={classes.wrapper}>
          {isLoading ? <CircularProgress className={classes.progress} /> :
            <div className={classes.listRoot}>
              <Grow in={!isLoading}>
                <div className={classes.list}>
                  <Pageination nextPage={getNextPage} page={nextPage}>
                    {displayedNews && displayedNews.map((value) => (
                      <NewsListItem key={value.id} data={value} />
                    ))}
                  </Pageination>
                  {displayedNews.length === 0 && !isLoading &&
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
