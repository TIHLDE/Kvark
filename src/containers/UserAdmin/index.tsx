import { Fragment, useEffect, useMemo, useState } from 'react';
import Helmet from 'react-helmet';
import { useUsers } from 'api/hooks/User';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

// Icons
import MembersIcon from '@material-ui/icons/PlaylistAddCheckRounded';
import WaitingIcon from '@material-ui/icons/PlaylistAddRounded';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Pageination from 'components/layout/Pageination';
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import PersonListItem, { PersonListItemLoading } from 'containers/UserAdmin/components/PersonListItem';

const useStyles = makeStyles((theme) => ({
  top: {
    height: 220,
    background: theme.palette.colors.gradient.main.top,
  },
  content: {
    margin: '-60px auto 60px',
    position: 'relative',
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: theme.spacing(1),
    margin: theme.spacing(2, 0, 1),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

const USER_CLASSES = ['Alle', '1. klasse', '2. klasse', '3. klasse', '4. klasse', '5. klasse'];
const USER_STUDIES = ['Alle', 'Dataing', 'DigFor', 'DigSec', 'DigSam', 'Drift'];

const UserAdmin = () => {
  const classes = useStyles();
  const membersTab = { value: 'members', label: 'Medlemmer', icon: MembersIcon };
  const waitingTab = { value: 'waiting', label: 'Ventende', icon: WaitingIcon };
  const tabs = [membersTab, waitingTab];
  const [tab, setTab] = useState(membersTab.value);
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
      filters.user_class = userClassChoice;
    }
    return filters;
  }, [tab, userClassChoice, userStudyChoice, searchInput]);
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useUsers({ is_TIHLDE_member: tab === membersTab.value, ...filters });
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchInput(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Navigation banner={<div className={classes.top}></div>} fancyNavbar>
      <Helmet>
        <title>Brukeradmin</title>
      </Helmet>
      <Paper className={classes.content}>
        <Typography variant='h1'>Brukeradmin</Typography>
        <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
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
          <Pageination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            {data.pages.map((page, i) => (
              <Fragment key={i}>
                {page.results.map((user) => (
                  <PersonListItem key={user.user_id} user={user} />
                ))}
              </Fragment>
            ))}
          </Pageination>
        )}
      </Paper>
    </Navigation>
  );
};

export default UserAdmin;
