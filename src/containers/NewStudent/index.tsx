import { useState, Fragment, useMemo } from 'react';
import classnames from 'classnames';
import { useQuery } from 'react-query';
import { usePage } from 'api/hooks/Pages';
import { useEvents } from 'api/hooks/Event';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@material-ui/core';

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
import Pagination from 'components/layout/Pagination';
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import EventsCalendarView from 'containers/Landing/components/EventsCalendarView';

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

const FADDERUKA_EVENT_CATEGORY = 10;

const useGithubContent = (url: string) => useQuery(['github-wiki', url], () => fetch(url).then((res) => res.text()));

const NewStudent = () => {
  const classes = useStyles();
  const eventsTab = { value: 'events', label: 'Arrangementer', icon: EventIcon };
  const faqTab = { value: 'faq', label: 'FAQ', icon: FaqIcon };
  const volunteerTab = { value: 'volunteer', label: 'Verv', icon: VolunteerIcon };
  const sportsTab = { value: 'sports', label: 'Idrett', icon: SportsIcon };
  const tabs = [eventsTab, faqTab, volunteerTab, sportsTab];
  const [tab, setTab] = useState(eventsTab.value);

  const eventsListView = { value: 'list', label: 'Liste', icon: EventIcon };
  const eventsCalendarView = { value: 'calendar', label: 'Kalender', icon: FaqIcon };
  const eventTabs = [eventsListView, eventsCalendarView];
  const [eventTab, setEventTab] = useState(eventsListView.value);

  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents({ category: FADDERUKA_EVENT_CATEGORY });
  const noEventsFound = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);
  const { data: faqPage } = usePage('ny-student/');
  const { data: volunteerText = '' } = useGithubContent('https://raw.githubusercontent.com/wiki/TIHLDE/Kvark/Verv-fadderuka-info.md');
  const { data: sportsText = '' } = useGithubContent('https://raw.githubusercontent.com/wiki/TIHLDE/Kvark/Idrett-fadderuka-info.md');

  return (
    <Page
      banner={<Banner text='Velkommen til alle nye studenter i TIHLDE! Her finner du info om fadderuka, verv og ofte stilte spørsmål.' title='Ny student' />}
      options={{ title: 'Ny student' }}>
      <div className={classnames(classes.grid, classes.root)}>
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
        <div>
          <Collapse in={tab === eventsTab.value}>
            <Tabs selected={eventTab} setSelected={setEventTab} tabs={eventTabs} />
            <Collapse in={eventTab === eventsListView.value}>
              {isLoading && <ListItemLoading />}
              {noEventsFound && (
                <NotFoundIndicator
                  header='Fant ingen arrangementer'
                  subtitle='Ingen arrangementer tilknyttet fadderuka er publisert enda. Kom tilbake senere!'
                />
              )}
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
            </Collapse>
            <Collapse in={eventTab === eventsCalendarView.value}>
              {/* Calender funker ikke... */}
              <EventsCalendarView events={data?.pages[0]?.results || []} oldEvents={[]} />
            </Collapse>
          </Collapse>
          <Collapse in={tab === faqTab.value}>
            <Paper sx={{ p: 2 }}>
              <MarkdownRenderer value={faqPage?.content || ''} />
            </Paper>
          </Collapse>
          <Collapse in={tab === volunteerTab.value}>
            <Paper sx={{ p: 2 }}>
              <MarkdownRenderer value={volunteerText} />
            </Paper>
          </Collapse>
          <Collapse in={tab === sportsTab.value}>
            <Paper sx={{ p: 2 }}>
              <MarkdownRenderer value={sportsText} />
            </Paper>
          </Collapse>
        </div>
      </div>
    </Page>
  );
};

export default NewStudent;
