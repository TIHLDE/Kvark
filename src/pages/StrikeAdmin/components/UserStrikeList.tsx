import { Fragment, useEffect, useMemo, useState } from 'react';
import { useUsers } from 'hooks/User';
import { makeStyles } from '@mui/styles';

// Project Components
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import UserListItem from 'pages/StrikeAdmin/components/UserListItem';
import { PersonListItemLoading } from 'pages/UserAdmin/components/PersonListItem';
import { MenuItem, TextField } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  content: {
    margin: '-60px auto 60px',
    position: 'relative',
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: theme.spacing(1),
    margin: theme.spacing(2, 0, 1),
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

const USER_CLASSES = ['Alle', '1. klasse', '2. klasse', '3. klasse', '4. klasse', '5. klasse', 'Alumni'];
const USER_STUDIES = ['Alle', 'Dataing', 'DigFor', 'DigSec', 'DigSam', 'Drift'];

const UserStrikeList = () => {
  const classes = useStyles();
  const [userClassChoice, setUserClassChoice] = useState(0);
  const [userStudyChoice, setUserStudyChoice] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const filters = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};
    if (searchInput !== '') {
      filters.search = searchInput;
    }
    if (userStudyChoice !== 0) {
      filters.user_study = userStudyChoice;
    }
    if (userClassChoice !== 0) {
      filters.user_class = userClassChoice === 6 ? -1 : userClassChoice;
    }
    return filters;
  }, [userClassChoice, userStudyChoice, searchInput]);

  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useUsers(filters);
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchInput(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Fragment>
      <div className={classes.filterContainer}>
        <TextField fullWidth label='Klasser' onChange={(e) => setUserClassChoice(Number(e.target.value))} select value={userClassChoice} variant='outlined'>
          {USER_CLASSES.map((value, index) => (
            <MenuItem key={index} value={index}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField fullWidth label='Studie' onChange={(e) => setUserStudyChoice(Number(e.target.value))} select value={userStudyChoice} variant='outlined'>
          {USER_STUDIES.map((value, index) => (
            <MenuItem key={index} value={index}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField fullWidth label='Søk' onChange={(e) => setSearch(e.target.value)} placeholder='Skriv her' value={search} variant='outlined' />
      </div>
      {isLoading && <PersonListItemLoading />}
      {isEmpty && <NotFoundIndicator header='Fant ingen brukere' />}
      {error && <Paper>{error.detail}</Paper>}
      {data !== undefined && (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          {data.pages.map((page, i) => (
            <Fragment key={i}>
              {page.results.map((user) => (
                <UserListItem key={user.user_id} user={user} />
              ))}
            </Fragment>
          ))}
        </Pagination>
      )}
    </Fragment>
  );
};

export default UserStrikeList;
