import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// API and store imports
import { useNews } from '../../api/hooks/News';

// Material Components
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grow from '@material-ui/core/Grow';

// Project components
import ListItem from '../../components/miscellaneous/ListItem';
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
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
  listRoot: {
    display: 'grid',
    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: theme.spacing(0, 1),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  first: {
    gridColumn: 'span 3',
    [theme.breakpoints.down('md')]: {
      gridColumn: 'span 1',
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
    <Navigation fancyNavbar>
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
                  {displayedNews?.map((newsItem, i) => (
                    <ListItem className={i === 0 ? classes.first : ''} key={newsItem.id} largeImg={i === 0} news={newsItem} />
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
