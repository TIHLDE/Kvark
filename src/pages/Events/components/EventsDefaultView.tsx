import { useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEvents } from 'hooks/Event';
import { useCategories } from 'hooks/Categories';
import { argsToParams } from 'utils';

// Material UI Components
import { makeStyles } from 'makeStyles';
import { Divider, MenuItem, Button, useMediaQuery, Theme, Stack } from '@mui/material';

// Project Components
import Page from 'components/navigation/Page';
import Pagination from 'components/layout/Pagination';
import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';
import Paper from 'components/layout/Paper';
import Select from 'components/inputs/Select';
import Bool from 'components/inputs/Bool';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { useGoogleAnalytics } from 'hooks/Utils';
import Expand from 'components/layout/Expand';

const useStyles = makeStyles()((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gridGap: theme.spacing(2),
    alignItems: 'self-start',
    paddingBottom: theme.spacing(2),

    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
    },
  },
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(1),
    [theme.breakpoints.down('lg')]: {
      order: 1,
    },
  },
  settings: {
    display: 'grid',
    gridGap: theme.spacing(1),
    position: 'sticky',
    top: 80,

    [theme.breakpoints.down('lg')]: {
      order: 0,
      position: 'static',
      top: 0,
    },
  },
}));

type Filters = {
  search?: string;
  category?: string;
  expired: boolean;
};

const Events = () => {
  const { event } = useGoogleAnalytics();
  const getInitialFilters = useCallback((): Filters => {
    const params = new URLSearchParams(location.search);
    const expired = params.get('expired') ? Boolean(params.get('expired') === 'true') : false;
    const category = params.get('category') || undefined;
    const search = params.get('search') || undefined;
    return { expired, category, search };
  }, []);
  const { classes } = useStyles();
  const navigate = useNavigate();
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const { data: categories = [] } = useCategories();
  const [filters, setFilters] = useState<Filters>(getInitialFilters());
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents(filters);
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const { register, control, handleSubmit, setValue, formState } = useForm<Filters>({ defaultValues: getInitialFilters() });
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  const resetFilters = () => {
    setValue('category', '');
    setValue('search', '');
    setValue('expired', false);
    setFilters({ expired: false });
    navigate(`${location.pathname}${argsToParams({ expired: false })}`, { replace: true });
  };

  const search = (data: Filters) => {
    event('search', 'events', JSON.stringify(data));
    setFilters(data);
    navigate(`${location.pathname}${argsToParams(data)}`, { replace: true });
    !lgDown || setSearchFormExpanded((prev) => !prev);
  };

  const [searchFormExpanded, setSearchFormExpanded] = useState(false);

  const SearchForm = () => (
    <form onSubmit={handleSubmit(search)}>
      <TextField disabled={isFetching} formState={formState} label='Søk' margin='none' {...register('search')} />
      {Boolean(categories.length) && (
        <Select control={control} formState={formState} label='Kategori' name='category'>
          {categories.map((value, index) => (
            <MenuItem key={index} value={value.id}>
              {value.text}
            </MenuItem>
          ))}
        </Select>
      )}
      <Bool control={control} formState={formState} label='Tidligere' name='expired' type='switch' />
      <SubmitButton disabled={isFetching} formState={formState}>
        Søk
      </SubmitButton>
      <Divider sx={{ my: 1 }} />
      <Button color='error' fullWidth onClick={resetFilters} variant='outlined'>
        Tilbakestill
      </Button>
    </form>
  );

  return (
    <Page>
      <div className={classes.grid}>
        <div className={classes.list}>
          {isLoading && <EventListItemLoading />}
          {isEmpty && <NotFoundIndicator header='Fant ingen arrangementer' />}
          {error && <Paper>{error.detail}</Paper>}
          {data !== undefined && (
            <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
              <Stack gap={1}>
                {events.map((event) => (
                  <EventListItem event={event} key={event.id} />
                ))}
              </Stack>
            </Pagination>
          )}
          {isFetching && <EventListItemLoading />}
        </div>
        {lgDown ? (
          <div>
            <Expand expanded={searchFormExpanded} flat header='Filtrering' onChange={() => setSearchFormExpanded((prev) => !prev)}>
              <SearchForm />
            </Expand>
          </div>
        ) : (
          <Paper className={classes.settings}>
            <SearchForm />
          </Paper>
        )}
      </div>
    </Page>
  );
};

export default Events;
