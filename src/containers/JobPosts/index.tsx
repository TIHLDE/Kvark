import { Fragment, useMemo, useState } from 'react';
import Helmet from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useJobPosts } from 'api/hooks/JobPost';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Banner from 'components/layout/Banner';
import Pageination from 'components/layout/Pageination';
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';
import Paper from 'components/layout/Paper';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import NoPostsIndicator from 'containers/JobPosts/components/NoPostsIndicator';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gridGap: theme.spacing(2),
    alignItems: 'self-start',
    paddingBottom: theme.spacing(2),

    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.down('md')]: {
      order: 1,
    },
  },
  settings: {
    display: 'grid',
    gridGap: theme.spacing(1),
    position: 'sticky',
    top: 88,

    [theme.breakpoints.down('md')]: {
      order: 0,
      position: 'static',
      top: 0,
    },
  },
  resetBtn: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.light,
    },
  },
}));

type Filters = {
  search?: string;
};

const JobPosts = () => {
  const classes = useStyles();
  const [filters, setFilters] = useState<Filters>({});
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useJobPosts(filters);
  const { register, handleSubmit, setValue } = useForm<Filters>();
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  const resetFilters = () => {
    setValue('search', '');
    setFilters({});
  };

  const search = (data: Filters) => {
    setFilters(data.search?.trim() !== '' ? { search: data.search } : {});
  };

  return (
    <Navigation banner={<Banner title='Karriere' />} fancyNavbar>
      <Helmet>
        <title>Karriere</title>
      </Helmet>
      <div className={classes.grid}>
        <div className={classes.list}>
          {isLoading && <ListItemLoading />}
          {isEmpty && <NoPostsIndicator />}
          {error && <Paper>{error.detail}</Paper>}
          {data !== undefined && (
            <Pageination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
              {data.pages.map((page, i) => (
                <Fragment key={i}>
                  {page.results.map((jobpost) => (
                    <ListItem jobpost={jobpost} key={jobpost.id} />
                  ))}
                </Fragment>
              ))}
            </Pageination>
          )}
          {isFetching && <ListItemLoading />}
        </div>
        <Paper className={classes.settings}>
          <form onSubmit={handleSubmit(search)}>
            <TextField disabled={isFetching} errors={{}} label='Søk' name='search' register={register} />
            <SubmitButton disabled={isFetching} errors={{}}>
              Søk
            </SubmitButton>
          </form>
          <Divider />
          <Button fullWidth onClick={resetFilters} variant='outlined'>
            Tilbakestill
          </Button>
        </Paper>
      </div>
    </Navigation>
  );
};

export default JobPosts;
