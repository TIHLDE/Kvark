import GroupIcon from '@mui/icons-material/Group';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'makeStyles';
import { useState } from 'react';

import AllStrikesList from 'pages/StrikeAdmin/components/AllStrikeList';
import UserStrikeList from 'pages/StrikeAdmin/components/UserStrikeList';

import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import { PrimaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';

const useStyles = makeStyles()(() => ({
  content: {
    margin: '-60px auto 60px',
    position: 'relative',
  },
}));

const StrikeAdmin = () => {
  const { classes } = useStyles();
  const strikesTab = { value: 'strikes', label: 'Medlemmer med prikker', icon: GroupIcon };
  const allStrikesTab = { value: 'allStrikes', label: 'Alle prikker', icon: WorkspacesIcon };
  const tabs = [strikesTab, allStrikesTab];
  const [tab, setTab] = useState(strikesTab.value);

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: 'Prikker admin' }}>
      <Paper className={classes.content}>
        <Typography variant='h1'>Prikker admin</Typography>
        <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
        {tab === strikesTab.value ? <UserStrikeList /> : <AllStrikesList />}
      </Paper>
    </Page>
  );
};

export default StrikeAdmin;
