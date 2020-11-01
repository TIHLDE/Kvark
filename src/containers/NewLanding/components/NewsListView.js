import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import URLS from '../../../URLS';
import { getFormattedDate } from '../../../utils';
import { Link } from 'react-router-dom';
import moment from 'moment';

// API and store imports
import { useNews } from '../../../api/hooks/News';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

// Icons
import DateIcon from '@material-ui/icons/DateRange';

// Project componets
import ListItem from '../../../components/miscellaneous/ListItem';

// Styles
const styles = (theme) => ({
  newsListContainer: {
    display: 'grid',
    gridGap: 1,
    color: theme.palette.text.secondary,
    margin: 'auto',
    padding: '0 6px',
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

const today = new Date();
today.setDate(today.getDate() - 7);
const lastWeek = moment(today, ['YYYY-MM-DD HH:mm:ss'], 'nb');

function NewsListView({ classes }) {
  const { getNews } = useNews();
  const [news, setNews] = useState(null);
  const [newsToDisplay, setNewsToDisplay] = useState(1);

  useEffect(() => {
    getNews()
      .then((news) => {
        // Calculate how many news to show based on created news last 7 days. Minimum 1 and max 3
        const freshNews = news.filter((n) => moment(n.created_at, ['YYYY-MM-DD HH:mm:ss'], 'nb') > lastWeek);
        setNewsToDisplay(Math.min(Math.max(parseInt(freshNews.length), 1), 3));
        setNews(news);
      })
      .catch(() => {
        setNewsToDisplay(0);
        setNews([]);
      });
  }, [getNews]);

  let newsList = (
    <div className={classes.noEventText}>
      <CircularProgress className={classes.progress} />
    </div>
  );
  if (news) {
    newsList = news.length ? (
      <React.Fragment>
        {news.map((newsItem, index) => {
          if (index < newsToDisplay) {
            return (
              <ListItem
                img={newsItem.image}
                imgAlt={newsItem.image_alt}
                info={[{ label: getFormattedDate(moment(newsItem.created_at, ['YYYY-MM-DD HH:mm'], 'nb')), icon: DateIcon }]}
                key={newsItem.id}
                link={`${URLS.news}${newsItem.id}/`}
                title={newsItem.title}
              />
            );
          }
          return '';
        })}
        <Button className={classes.btn} color='primary' component={Link} to={URLS.news} variant='outlined'>
          <Typography align='center'>Alle nyheter</Typography>
        </Button>
      </React.Fragment>
    ) : (
      <Typography align='center' className={classes.noEventText} variant='subtitle1'>
        Ingen nyheter å vise
      </Typography>
    );
  }

  return <div className={classes.newsListContainer}>{newsList}</div>;
}

NewsListView.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

export default withStyles(styles)(NewsListView);
