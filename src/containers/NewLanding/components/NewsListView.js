import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import URLS from '../../../URLS';
import { Link } from 'react-router-dom';

// API and store imports
import { useNews } from '../../../api/hooks/News';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

// Project componets
import ListItem from '../../../components/miscellaneous/ListItem';

// Styles
const styles = (theme) => ({
  newsListContainer: {
    display: 'grid',
    gridGap: theme.spacing(0, 1),
    color: theme.palette.text.secondary,
    margin: 'auto',
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
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
  btn: {
    padding: theme.spacing(1),
  },
});

function NewsListView({ classes }) {
  const { getNews } = useNews();
  const [news, setNews] = useState(null);

  useEffect(() => {
    getNews()
      .then((news) => {
        setNews(news);
      })
      .catch(() => {
        setNews([]);
      });
  }, [getNews]);

  if (!news) {
    return (
      <div className={classes.noEventText}>
        <CircularProgress className={classes.progress} />
      </div>
    );
  } else if (news.length) {
    return (
      <>
        <div className={classes.newsListContainer}>{news.map((newsItem, index) => index < 2 && <ListItem key={index} news={newsItem} />)}</div>
        <Button className={classes.btn} color='primary' component={Link} fullWidth to={URLS.news} variant='outlined'>
          Alle nyheter
        </Button>
      </>
    );
  } else {
    return (
      <Typography align='center' className={classes.noEventText} variant='subtitle1'>
        Ingen nyheter å vise
      </Typography>
    );
  }
}

NewsListView.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

export default withStyles(styles)(NewsListView);
