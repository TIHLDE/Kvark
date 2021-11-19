import { useMemo } from 'react';
import { makeStyles } from 'makeStyles';
import Typography from '@mui/material/Typography';

// Project componets
import NewsListItem, { NewsListItemLoading } from 'components/miscellaneous/NewsListItem';
import { useNews } from 'hooks/News';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'grid',
    gridGap: theme.spacing(1),
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('md')]: {
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
  const { data, isLoading } = useNews();
  const news = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const { classes } = useStyles();

  if (isLoading) {
    return (
      <div className={classes.container}>
        <NewsListItemLoading />
        <NewsListItemLoading />
      </div>
    );
  } else if (news.length) {
    return <div className={classes.container}>{news.map((newsItem, index) => index < NO_OF_NEWS_TO_SHOW && <NewsListItem key={index} news={newsItem} />)}</div>;
  } else {
    return (
      <Typography align='center' className={classes.noNewsText} variant='subtitle1'>
        Fant ingen nyheter
      </Typography>
    );
  }
};

export default NewsListView;
