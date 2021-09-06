import { Fragment, useMemo } from 'react';
import { useNews } from 'hooks/News';

// Material UI Components
import { makeStyles } from '@mui/styles';

// Project Components
import Page from 'components/navigation/Page';
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
    [theme.breakpoints.down('lg')]: {
      gridGap: theme.spacing(1),
      gridTemplateColumns: '1fr',
    },
  },
  first: {
    gridColumn: 'span 3',
    [theme.breakpoints.down('lg')]: {
      gridColumn: 'span 1',
    },
  },
}));

const News = () => {
  const classes = useStyles();
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useNews();
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  return (
    <Page banner={<Banner title='Nyheter' />} options={{ title: 'Nyheter' }}>
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
    </Page>
  );
};

export default News;
