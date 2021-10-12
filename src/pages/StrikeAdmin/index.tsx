import { useEffect, useMemo, useState } from 'react';

// Material UI Components
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// Icons
import MembersIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import WaitingIcon from '@mui/icons-material/PlaylistAddRounded';

// Project Components
import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import { PrimaryTopBox } from 'components/layout/TopBox';
import UserStrikeList from 'pages/StrikeAdmin/components/UserStrikeList';

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

const StrikeAdmin = () => {
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
      filters.user_class = userClassChoice === 6 ? -1 : userClassChoice;
    }
    return filters;
  }, [tab, userClassChoice, userStudyChoice, searchInput]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchInput(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: 'Prikke admin' }}>
      <Paper className={classes.content}>
        <Typography variant='h1'>Prikke admin</Typography>
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
        <UserStrikeList filters={filters}/>
      </Paper>
    </Page>
  );
};

export default StrikeAdmin;
