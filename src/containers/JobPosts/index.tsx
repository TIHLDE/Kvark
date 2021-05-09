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
import Pagination from 'components/layout/Pagination';
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';
import Paper from 'components/layout/Paper';
import Bool from 'components/inputs/Bool';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

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
  expired: boolean;
};

const JobPosts = () => {
  const classes = useStyles();
  const [filters, setFilters] = useState<Filters>({ expired: false });
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useJobPosts(filters);
  const { register, control, handleSubmit, setValue } = useForm<Filters>();
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  const resetFilters = () => {
    setValue('search', '');
    setValue('expired', false);
    setFilters({ expired: false });
  };

  const search = (data: Filters) => {
    setFilters({ ...data, search: data.search?.trim() !== '' ? data.search : undefined });
  };

  return (
    <Navigation banner={<Banner title='Karriere' />} fancyNavbar>
      <Helmet>
        <title>Karriere</title>
      </Helmet>
      <div className={classes.grid}>
        <div className={classes.list}>
          {isLoading && <ListItemLoading />}
          {isEmpty && <NotFoundIndicator header='Fant ingen annonser' />}
          {error && <Paper>{error.detail}</Paper>}
          {data !== undefined && (
            <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
              {data.pages.map((page, i) => (
                <Fragment key={i}>
                  {page.results.map((jobpost) => (
                    <ListItem jobpost={jobpost} key={jobpost.id} />
                  ))}
                </Fragment>
              ))}
            </Pagination>
          )}
          {isFetching && <ListItemLoading />}
        </div>
        <Paper className={classes.settings}>
          <form onSubmit={handleSubmit(search)}>
            <TextField disabled={isFetching} errors={{}} label='Søk' name='search' register={register} />
            <Bool control={control} errors={{}} label='Tidligere' name='expired' type='switch' />
            <SubmitButton disabled={isFetching} errors={{}}>
              Søk
            </SubmitButton>
          </form>
          <Divider />
          <Button className={classes.resetBtn} fullWidth onClick={resetFilters} variant='outlined'>
            Tilbakestill
          </Button>
        </Paper>
      </div>
    </Navigation>
  );
};

export default JobPosts;
