import { useState, Fragment, useMemo } from 'react';
import classnames from 'classnames';
import { useQuery } from 'react-query';
import { usePage } from 'api/hooks/Pages';
import { useEvents } from 'api/hooks/Event';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography, Button } from '@material-ui/core';

// Icons
import EventIcon from '@material-ui/icons/EventRounded';
import FaqIcon from '@material-ui/icons/HelpOutlineRounded';
import VolunteerIcon from '@material-ui/icons/VolunteerActivismRounded';
import SportsIcon from '@material-ui/icons/SportsSoccerRounded';
import ListIcon from '@material-ui/icons/FormatListBulletedRounded';
import CalendarIcon from '@material-ui/icons/DateRangeRounded';
import SignupIcon from '@material-ui/icons/ArrowForwardRounded';
import OpenInNewIcon from '@material-ui/icons/OpenInNewRounded';

// Project Components
import Page from 'components/navigation/Page';
import Banner, { BannerButton } from 'components/layout/Banner';
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
}));

const FADDERUKA_EVENT_CATEGORY = 10;

const useGithubContent = (url: string) => useQuery(['github-wiki', url], () => fetch(url).then((res) => res.text()));

const NewStudent = () => {
  const classes = useStyles();

  const eventsTab = { value: 'events', label: 'Fadderuka - arrangementer', icon: EventIcon };
  const faqTab = { value: 'faq', label: 'FAQ', icon: FaqIcon };
  const volunteerTab = { value: 'volunteer', label: 'Verv', icon: VolunteerIcon };
  const sportsTab = { value: 'sports', label: 'Idrett', icon: SportsIcon };
  const tabs = [eventsTab, faqTab, volunteerTab, sportsTab];
  const [tab, setTab] = useState(eventsTab.value);

  const eventsListView = { value: 'list', label: 'Liste', icon: ListIcon };
  const eventsCalendarView = { value: 'calendar', label: 'Kalender', icon: CalendarIcon };
  const eventTabs = [eventsListView, eventsCalendarView];
  const [eventTab, setEventTab] = useState(eventsListView.value);

  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents({ category: FADDERUKA_EVENT_CATEGORY });
  const noEventsFound = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);
  const { data: faqPage } = usePage('ny-student/');
  const { data: volunteerText = '' } = useGithubContent('https://raw.githubusercontent.com/wiki/TIHLDE/Kvark/Verv-fadderuka-info.md');
  const { data: sportsText = '' } = useGithubContent('https://raw.githubusercontent.com/wiki/TIHLDE/Kvark/Idrett-fadderuka-info.md');

  return (
    <Page
      banner={
        <Banner
          text='Hei og velkommen til TIHLDE. Vi i TIHLDE vil gjerne ønske deg velkommen til Trondheim og vil at du skal bli kjent med både byen og dine medstudenter derfor arrangerer vi fadderuka for dere. Her kan du finne info om fadderuka, verv og idrett i TIHLDE, samt ofte stilte spørsmål og svar.'
          title='Ny student'>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <BannerButton component='a' endIcon={<OpenInNewIcon />} href='https://tihlde.org/#TODO-bytt-ut' rel='noopener noreferrer' target='_blank'>
            Meld deg på fadderuka
          </BannerButton>
          <Paper>
            <Typography gutterBottom>
              Hei! Hvis du er ny student i TIHLDE anbefaler vi deg å opprette bruker på nettsiden ASAP! Da får du muligheten til å melde deg på arrangementer,
              få badges, se kokeboka og mer.
            </Typography>
            <Button component={Link} endIcon={<SignupIcon />} fullWidth to={URLS.signup} variant='outlined'>
              Opprett bruker her
            </Button>
          </Paper>
        </Banner>
      }
      options={{ title: 'Ny student' }}>
      <div className={classnames(classes.grid, classes.root)}>
        <Paper noOverflow noPadding sx={{ position: { lg: 'sticky' }, top: { lg: 75 } }}>
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
            <Tabs selected={eventTab} setSelected={setEventTab} sx={{ ml: 2 }} tabs={eventTabs} />
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
