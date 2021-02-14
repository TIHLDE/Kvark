import { Fragment, useMemo } from 'react';
import Helmet from 'react-helmet';
import { useNews } from 'api/hooks/News';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Banner from 'components/layout/Banner';
import Pagination from 'components/layout/Pagination';
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(2),
  },
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: theme.spacing(0, 1),
    [theme.breakpoints.down('md')]: {
      gridGap: theme.spacing(1),
      gridTemplateColumns: '1fr',
    },
  },
  first: {
    gridColumn: 'span 3',
    [theme.breakpoints.down('md')]: {
      gridColumn: 'span 1',
    },
  },
}));

const News = () => {
  const classes = useStyles();
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useNews();
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  return (
    <Navigation banner={<Banner title='Nyheter' />} fancyNavbar>
      <Helmet>
        <title>Nyheter</title>
      </Helmet>
      <div className={classes.root}>
        {isLoading && <ListItemLoading />}
        {isEmpty && <NotFoundIndicator header='Fant ingen nyheter' />}
        {error && <Paper>{error.detail}</Paper>}
        {data !== undefined && (
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            <div className={classes.list}>
              {data.pages.map((page, i) => (
                <Fragment key={i}>
                  {page.results.map((newsItem, j) => (
                    <ListItem className={i === 0 && j === 0 ? classes.first : ''} key={newsItem.id} largeImg={i === 0} news={newsItem} />
                  ))}
                </Fragment>
              ))}
            </div>
          </Pagination>
        )}
        {isFetching && <ListItemLoading />}
      </div>
    </Navigation>
  );
};

export default News;
