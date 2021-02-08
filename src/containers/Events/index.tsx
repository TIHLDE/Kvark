import { Fragment, useEffect, useMemo, useState } from 'react';
import Helmet from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useEvents } from 'api/hooks/Event';
import { useMisc } from 'api/hooks/Misc';
import { Category } from 'types/Types';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Banner from 'components/layout/Banner';
import Pageination from 'components/layout/Pageination';
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';
import Paper from 'components/layout/Paper';
import Select from 'components/inputs/Select';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import NoEventsIndicator from 'containers/Events/components/NoEventsIndicator';

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
  category?: string;
};

const Events = () => {
  const classes = useStyles();
  const { getCategories } = useMisc();
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [filters, setFilters] = useState<Filters>({});
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents(filters);
  const { register, control, handleSubmit, setValue } = useForm<Filters>();
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const resetFilters = () => {
    setValue('category', '');
    setValue('search', '');
    setFilters({});
  };

  const search = (data: Filters) => setFilters(data);

  return (
    <Navigation banner={<Banner title='Arrangementer' />} fancyNavbar>
      <Helmet>
        <title>Arrangementer</title>
      </Helmet>
      <div className={classes.grid}>
        <div className={classes.list}>
          {isLoading && <ListItemLoading />}
          {isEmpty && <NoEventsIndicator />}
          {error && <Paper>{error.detail}</Paper>}
          {data !== undefined && (
            <Pageination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
              {data.pages.map((page, i) => (
                <Fragment key={i}>
                  {page.results.map((event) => (
                    <ListItem event={event} key={event.id} />
                  ))}
                </Fragment>
              ))}
            </Pageination>
          )}
          {isFetching && <ListItemLoading />}
        </div>
        <Paper className={classes.settings}>
          <form onSubmit={handleSubmit(search)}>
            <TextField disabled={isFetching} errors={{}} label='Søk' margin='none' name='search' register={register} />
            <Select control={control} errors={{}} label='Kategori' name='category'>
              {categories.map((value, index) => (
                <MenuItem key={index} value={value.id}>
                  {value.text}
                </MenuItem>
              ))}
            </Select>
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

export default Events;
