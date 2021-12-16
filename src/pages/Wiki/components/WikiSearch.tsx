import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePages } from 'hooks/Pages';
import { useDebounce, useGoogleAnalytics } from 'hooks/Utils';
import { TextField, Collapse, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PageIcon from '@mui/icons-material/SubjectRounded';

// Project components
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import Pagination from 'components/layout/Pagination';
import { BannerButton } from 'components/layout/Banner';

const WikiSearch = () => {
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
      <BannerButton onClick={toggle} variant='outlined'>
        Søk
      </BannerButton>
      <Dialog onClose={toggle} open={open}>
        <TextField autoFocus fullWidth label='Søk i Wiki' onChange={(e) => setSearch(e.target.value)} sx={{ mb: 1 }} value={search} variant='outlined' />
        <Collapse in={Boolean(pages.length && !isLoading)}>
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere sider' nextPage={() => fetchNextPage()}>
            <Paper noOverflow noPadding>
              <List disablePadding>
                {pages.map((page, i) => (
                  <ListItem disablePadding divider={pages.length - 1 !== i} key={page.path}>
                    <ListItemButton component={Link} onClick={toggle} to={page.path}>
                      <ListItemIcon>
                        <PageIcon />
                      </ListItemIcon>
                      <ListItemText primary={page.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Pagination>
        </Collapse>
        <Collapse in={Boolean(!pages.length && debouncedSearch.length && !isLoading)}>
          <Typography align='center' variant='subtitle2'>
            Fant ingen sider
          </Typography>
        </Collapse>
        <Collapse in={Boolean(!debouncedSearch.length)}>
          <Typography align='center' variant='subtitle2'>
            {`Søk etter innhold for å se resultater, for eks: "Lambo"`}
          </Typography>
        </Collapse>
      </Dialog>
    </>
  );
};

export default WikiSearch;
