import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import URLS from '../../URLS';
import { getFormattedDate } from '../../utils';
import moment from 'moment';

// API and store imports
import { useNews } from '../../api/hooks/News';

// Material Components
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grow from '@material-ui/core/Grow';

// Icons
import DateIcon from '@material-ui/icons/DateRange';

// Project components
import ListItem from '../../components/miscellaneous/ListItem';
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
import NoNewsIndicator from './components/NoNewsIndicator';

const styles = () => ({
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
  const { classes } = props;

  const { getNews } = useNews();
  const [displayedNews, setDisplayedNews] = useState(null);

  useEffect(() => {
    getNews()
      .then((news) => {
        setDisplayedNews(news);
      })
      .catch(() => setDisplayedNews([]));
  }, [getNews]);

  return (
    <Navigation fancyNavbar whitesmoke>
      <Helmet>
        <title>Nyheter - TIHLDE</title>
      </Helmet>
      <div className={classes.root}>
        <Banner title='Nyheter' />
        <div className={classes.wrapper}>
          {!displayedNews ? (
            <CircularProgress className={classes.progress} />
          ) : (
            <div className={classes.listRoot}>
              <Grow in={Boolean(displayedNews)}>
                <div className={classes.list}>
                  {displayedNews?.map((newsItem) => (
                    <ListItem
                      img={newsItem.image}
                      imgAlt={newsItem.image_alt}
                      info={[{ label: getFormattedDate(moment(newsItem.created_at, ['YYYY-MM-DD HH:mm'], 'nb')), icon: DateIcon }]}
                      key={newsItem.id}
                      link={`${URLS.news}${newsItem.id}/`}
                      title={newsItem.title}
                    />
                  ))}
                  {!displayedNews.length && <NoNewsIndicator />}
                </div>
              </Grow>
            </div>
          )}
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

export default withStyles(styles)(News);
