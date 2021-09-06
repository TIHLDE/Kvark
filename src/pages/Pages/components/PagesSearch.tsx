import { useMemo, useState } from 'react';
import { usePages } from 'hooks/Pages';
import { useDebounce, useGoogleAnalytics } from 'hooks/Utils';

// Material UI Components
import { makeStyles } from '@mui/styles';
import { TextField, Collapse, Typography } from '@mui/material';

// Project components
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import Pagination from 'components/layout/Pagination';
import { BannerButton } from 'components/layout/Banner';
import PagesList from 'pages/Pages/components/PagesList';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

const PagesSearch = () => {
  const classes = useStyles();
  const { event } = useGoogleAnalytics();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const filters = useMemo(() => {
    const filters: Record<string, unknown> = {};
    if (debouncedSearch) {
      filters.search = debouncedSearch;
      event('search', 'pages', `Search for: ${debouncedSearch}`);
    }
    return filters;
  }, [debouncedSearch]);
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = usePages(filters);
  const pages = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  return (
    <>
      <BannerButton onClick={toggle}>Søk</BannerButton>
      <Dialog onClose={toggle} open={open}>
        <TextField fullWidth label='Søk etter side' onChange={(e) => setSearch(e.target.value)} value={search} variant='outlined' />
        <Collapse in={Boolean(pages.length && !isLoading)}>
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere sider' nextPage={() => fetchNextPage()}>
            <Paper className={classes.paper} noPadding>
              <PagesList linkOnClick={toggle} noBackLink pages={pages} />
            </Paper>
          </Pagination>
        </Collapse>
        <Collapse in={Boolean(!pages.length && debouncedSearch.length && !isLoading)}>
          <Typography align='center' className={classes.paper} variant='subtitle2'>
            Fant ingen sider
          </Typography>
        </Collapse>
        <Collapse in={Boolean(!debouncedSearch.length)}>
          <Typography align='center' className={classes.paper} variant='subtitle2'>
            Søk etter en side for å se resultater
          </Typography>
        </Collapse>
      </Dialog>
    </>
  );
};

export default PagesSearch;
