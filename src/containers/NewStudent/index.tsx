import { useState } from 'react';
import classnames from 'classnames';
import { useQuery } from 'react-query';
import { usePage } from 'api/hooks/Pages';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { useMediaQuery, Theme, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@material-ui/core';

// Icons
import EventIcon from '@material-ui/icons/EventRounded';
import FaqIcon from '@material-ui/icons/HelpOutlineRounded';
import VolunteerIcon from '@material-ui/icons/VolunteerActivismRounded';
import SportsIcon from '@material-ui/icons/SportsSoccerRounded';

// Project Components
import Page from 'components/navigation/Page';
import Banner from 'components/layout/Banner';
import Paper from 'components/layout/Paper';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import Tabs from 'components/layout/Tabs';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridGap: theme.spacing(2),
  },
  root: {
    gridTemplateColumns: '300px 1fr',
    margin: theme.spacing(1, 0, 2),
    alignItems: 'self-start',
    [theme.breakpoints.down('lg')]: {
      gridGap: theme.spacing(1),
      gridTemplateColumns: '1fr',
    },
  },
  inner: {},
  content: {
    [theme.breakpoints.down('lg')]: {
      gridGap: theme.spacing(1),
    },
  },
  list: {
    gridGap: theme.spacing(1),
  },
}));

const useGithubContent = (url: string) => useQuery(['github-wiki', url], () => fetch(url).then((res) => res.text()));

const NewStudent = () => {
  const classes = useStyles();
  const eventsTab = { value: 'events', label: 'Arrangementer', icon: EventIcon };
  const faqTab = { value: 'faq', label: 'FAQ', icon: FaqIcon };
  const volunteerTab = { value: 'volunteer', label: 'Verv', icon: VolunteerIcon };
  const sportsTab = { value: 'sports', label: 'Idrett', icon: SportsIcon };
  const tabs = [eventsTab, faqTab, volunteerTab, sportsTab];
  const [tab, setTab] = useState(eventsTab.value);
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const { data: faqPage } = usePage('ny-student/');
  const { data: volunteerText = '' } = useGithubContent('https://raw.githubusercontent.com/wiki/TIHLDE/Kvark/Verv-fadderuka-info.md');
  const { data: sportsText = '' } = useGithubContent('https://raw.githubusercontent.com/wiki/TIHLDE/Kvark/Idrett-fadderuka-info.md');

  return (
    <Page
      banner={<Banner text='Velkommen til alle nye studenter i TIHLDE. Her finner du info om fadderuka, verv og ofte stilte spørsmål.' title='Ny student' />}
      options={{ title: 'Ny student' }}>
      <div className={classnames(classes.grid, classes.root)}>
        {lgDown ? (
          <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
        ) : (
          <Paper noOverflow noPadding>
            <List disablePadding>
              {tabs.map((tabItem) => (
                <ListItemButton key={tabItem.value} onClick={() => setTab(tabItem.value)} selected={tab === tabItem.value}>
                  <ListItemIcon>
                    <tabItem.icon />
                  </ListItemIcon>
                  <ListItemText primary={tabItem.label} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
        <div className={classnames(classes.grid, classes.inner)}>
          <Paper>
            <Collapse in={tab === eventsTab.value}>
              <MarkdownRenderer value='' />
            </Collapse>
            <Collapse in={tab === faqTab.value}>
              <MarkdownRenderer value={faqPage?.content || ''} />
            </Collapse>
            <Collapse in={tab === volunteerTab.value}>
              <MarkdownRenderer value={volunteerText} />
            </Collapse>
            <Collapse in={tab === sportsTab.value}>
              <MarkdownRenderer value={sportsText} />
            </Collapse>
          </Paper>
        </div>
      </div>
    </Page>
  );
};

export default NewStudent;
