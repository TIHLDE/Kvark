import { Fragment, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEvents } from 'api/hooks/Event';
import { useMisc } from 'api/hooks/Misc';
import { Category } from 'types/Types';

// Material UI Components
import { makeStyles, Divider, MenuItem, Button } from '@material-ui/core';

// Project Components
import Page from 'components/navigation/Page';
import Banner from 'components/layout/Banner';
import Pagination from 'components/layout/Pagination';
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';
import Paper from 'components/layout/Paper';
import Select from 'components/inputs/Select';
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
  category?: string;
  expired: boolean;
};

const Events = () => {
  const classes = useStyles();
  const { getCategories } = useMisc();
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [filters, setFilters] = useState<Filters>({ expired: false });
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents(filters);
  const { register, control, handleSubmit, setValue } = useForm<Filters>();
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const resetFilters = () => {
    setValue('category', '');
    setValue('search', '');
    setValue('expired', false);
    setFilters({ expired: false });
  };

  const search = (data: Filters) => setFilters(data);

  return (
    <Page banner={<Banner title='Arrangementer' />} navigationOptions={{ title: 'Arrangementer' }}>
      <div className={classes.grid}>
        <div className={classes.list}>
          {isLoading && <ListItemLoading />}
          {isEmpty && <NotFoundIndicator header='Fant ingen arrangementer' />}
          {error && <Paper>{error.detail}</Paper>}
          {data !== undefined && (
            <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
              {data.pages.map((page, i) => (
                <Fragment key={i}>
                  {page.results.map((event) => (
                    <ListItem event={event} key={event.id} />
                  ))}
                </Fragment>
              ))}
            </Pagination>
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
    </Page>
  );
};

export default Events;
