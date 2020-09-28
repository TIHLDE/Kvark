import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import URLS from '../../../URLS';
import { getFormattedDate } from '../../../utils';
import moment from 'moment';

// API and store imports
import { useNews } from '../../../api/hooks/News';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Icons
import DateIcon from '@material-ui/icons/DateRange';

// Project componets
import LinkButton from '../../../components/navigation/LinkButton';
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
  moreBtn: {
    boxShadow: '0px 2px 4px ' + theme.palette.colors.border.main + '88, 0px 0px 4px ' + theme.palette.colors.border.main + '88',
    borderRadius: theme.palette.sizes.border.radius,
    overflow: 'hidden',
  },
});

function NewsListView({ classes }) {
  const [news, isLoading, isError] = useNews();
  const [newsToDisplay, setNewsToDisplay] = useState(1);
  const today = new Date();
  today.setDate(today.getDate() - 7);
  const lastWeek = moment(today, ['YYYY-MM-DD HH:mm:ss'], 'nb');

  useEffect(() => {
    // Calculate how many news to show based on created news last 7 days. Minimum 1 and max 3
    if (!isError) {
      const freshNews = news.filter((n) => moment(n.created_at, ['YYYY-MM-DD HH:mm:ss'], 'nb') > lastWeek);
      setNewsToDisplay(Math.min(Math.max(parseInt(freshNews.length), 1), 3));
    } else {
      setNewsToDisplay(0);
    }
  }, [news, lastWeek, isError]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let newsList = (
    <div className={classes.noEventText}>
      <CircularProgress className={classes.progress} />
    </div>
  );
  if (!isLoading) {
    newsList =
      news && news.length > 0 ? (
        <React.Fragment>
          {news.map((newsItem, index) => {
            if (index < newsToDisplay) {
              return (
                <ListItem
                  img={newsItem.image}
                  imgAlt={newsItem.image_alt}
                  info={[{ label: getFormattedDate(moment(newsItem.created_at, ['YYYY-MM-DD HH:mm'], 'nb')), icon: DateIcon }]}
                  key={newsItem.id}
                  link={URLS.news + ''.concat(newsItem.id, '/')}
                  title={newsItem.title}
                />
              );
            }
            return '';
          })}
          <div className={classes.moreBtn}>
            <LinkButton noPadding to={URLS.news}>
              <Typography align='center'>Alle nyheter</Typography>
            </LinkButton>
          </div>
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
