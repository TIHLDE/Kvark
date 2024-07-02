import { SHOW_FADDERUKA_INFO } from 'constant';
import { ArrowUpRightFromSquare, Award, Calendar, CircleHelp, HandHeart, Info, List } from 'lucide-react';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { useEvents } from 'hooks/Event';
import { useIsAuthenticated } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';
import { useWikiPage } from 'hooks/Wiki';

import EventsCalendarView from 'pages/Landing/components/EventsCalendarView';

import Paper from 'components/layout/Paper';
import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';
import { Button, PaginateButton } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import Expandable from 'components/ui/expandable';
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

const FADDERUKA_EVENT_CATEGORY = 10;

const useGithubContent = (url: string) => useQuery(['github-wiki', url], () => fetch(url).then((res) => res.text()));

type VolunteerGroupProps = {
  url: string;
  title: string;
};

const VolunteerGroup = ({ url, title }: VolunteerGroupProps) => {
  const { data } = useWikiPage(url);
  return (
    <Expandable description='Les mer' icon={<HandHeart className='w-5 h-5 stroke-[1.5px]' />} title={title}>
      <MarkdownRenderer value={data?.content || ''} />
    </Expandable>
  );
};

const NewStudent = () => {
  const { event } = useAnalytics();
  const isAuthenticated = useIsAuthenticated();
  const eventsTab = { value: 'events', label: 'Fadderuka', icon: Calendar };
  const faqTab = { value: 'faq', label: 'FAQ', icon: CircleHelp };
  const volunteerTab = { value: 'volunteer', label: 'Verv', icon: HandHeart };
  const sportsTab = { value: 'sports', label: 'Idrett', icon: Award };
  const aboutTab = { value: 'about', label: 'Om TIHLDE', icon: Info };
  const tabs = [eventsTab, faqTab, volunteerTab, sportsTab, aboutTab];

  const eventsListView = { value: 'list', label: 'Liste', icon: List };
  const eventsCalendarView = { value: 'calendar', label: 'Kalender', icon: Calendar };
  const eventTabs = [eventsListView, eventsCalendarView];

  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents({ category: FADDERUKA_EVENT_CATEGORY });
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const { data: faqPage } = useWikiPage('ny-student/');
  const { data: sportsText } = useWikiPage('tihlde/interessegrupper/tihlde-pythons/');
  const { data: aboutText = '' } = useGithubContent('https://raw.githubusercontent.com/wiki/TIHLDE/Kvark/Nettsiden-info.md');

  const fadderukaSignupAnalytics = () => event('signup-fadderuka', 'new-student', 'Clicked on link to signup for fadderuka');
  const createUserAnalytics = (page: string) => event('go-to-sign-up', 'new-student', `Go to ${page}`);

  return (
    <Page className='space-y-12'>
      <div className='space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0'>
        <div className='space-y-1'>
          <h1 className='text-3xl lg:text-5xl font-bold'>Ny student</h1>
          <p className='max-w-2xl w-full text-muted-foreground text-sm md:text-base'>
            Hei og velkommen til TIHLDE. Vi i TIHLDE vil gjerne ønske deg velkommen til Trondheim og vil at du skal bli kjent med både byen og dine
            medstudenter, derfor arrangerer vi fadderuka for dere. Her kan du finne info om fadderuka, verv og idrett i TIHLDE, samt ofte stilte spørsmål og
            svar. Vi gleder oss til å bli kjent med deg! 🎉
          </p>
        </div>

        {!isAuthenticated && (
          <div className='p-4 border dark:border-white rounded-md max-w-md w-full space-y-2'>
            <p className='text-sm'>
              Hei! Hvis du er ny student i TIHLDE anbefaler vi deg å opprette bruker på nettsiden ASAP! Da får du muligheten til å melde deg på arrangementer,
              få badges, se kokeboka og mer 🎉
            </p>
            <div className='flex items-center space-x-2'>
              <Button asChild>
                <Link onClick={() => createUserAnalytics('ny-bruker')} to={'/ny-bruker/'}>
                  Registrer deg her
                </Link>
              </Button>

              {!SHOW_FADDERUKA_INFO && (
                <Button asChild className='text-black dark:text-white' variant='outline'>
                  <a href='https://s.tihlde.org/fadderuka-paamelding' onClick={fadderukaSignupAnalytics} rel='noopener noreferrer' target='_blank'>
                    Meld deg på fadderuka
                    <ArrowUpRightFromSquare className='ml-2 w-5 h-5 stroke-[1.5px]' />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <Tabs className='space-y-4' defaultValue='events'>
        <ScrollArea className='w-full whitespace-nowrap p-0'>
          <TabsList>
            {tabs.map((tab, index) => (
              <TabsTrigger key={index} value={tab.value}>
                <tab.icon className='w-5 h-5 mr-2' />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
        <TabsContent value='events'>
          <Tabs defaultValue='list'>
            <TabsList>
              {eventTabs.map((tab, index) => (
                <TabsTrigger key={index} value={tab.value}>
                  <tab.icon className='w-5 h-5 mr-2' />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value='list'>
              {isLoading && <EventListItemLoading />}
              {!events.length && !isLoading && (
                <NotFoundIndicator
                  header='Fant ingen arrangementer'
                  subtitle='Ingen arrangementer tilknyttet fadderuka er publisert enda. Kom tilbake senere!'
                />
              )}
              {error && <Paper>{error.detail}</Paper>}
              {data !== undefined && (
                <div className='space-y-2'>
                  {events.map((event) => (
                    <EventListItem event={event} key={event.id} size='large' />
                  ))}
                </div>
              )}
              {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
            </TabsContent>
            <TabsContent value='calendar'>
              <EventsCalendarView category={FADDERUKA_EVENT_CATEGORY} />
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value='faq'>
          <Card>
            <CardContent className='px-6 py-4'>
              <MarkdownRenderer value={faqPage?.content || ''} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='volunteer'>
          <Card>
            <CardContent className='px-6 py-4 space-y-2'>
              <h1 className='text-xl md:selection:text-3xl font-bold'>Bli med som frivillig i TIHLDE</h1>
              <p>
                Som frivillig i TIHLDE får du være med på mye gøy og blir kjent med kule folk! Vi har 5 undergrupper og 5 komitéer som jobber for medlemmene
                våre. Her kan du lese mer om hva hver undergruppe/komité jobber med og hvordan du kan søke om å bli med i en eller flere.
              </p>
              <h1 className='text-lg font-bold'>Undergrupper:</h1>
              <div className='space-y-2'>
                <VolunteerGroup title='Index' url='tihlde/undergrupper/index/' />
                <VolunteerGroup title='Drift' url='tihlde/undergrupper/drift/' />
                <VolunteerGroup title='Næringsliv og Kurs' url='tihlde/undergrupper/nringsliv-og-kurs/' />
                <VolunteerGroup title='Promo' url='tihlde/undergrupper/promo/' />
                <VolunteerGroup title='Sosialen' url='tihlde/undergrupper/sosialen/' />
              </div>
              <h1 className='text-lg font-bold'>Komitéer:</h1>
              <div className='space-y-2'>
                <VolunteerGroup title='FadderKom' url='tihlde/komiteer/fadderkom/' />
                <VolunteerGroup title='JenteKom' url='tihlde/komiteer/jentekom/' />
                <VolunteerGroup title='KontKom' url='tihlde/komiteer/kontkom/' />
                <VolunteerGroup title='Redaksjonen' url='tihlde/komiteer/redaksjonen/' />
                <VolunteerGroup title='TurTorial' url='tihlde/komiteer/turtorial/' />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='sports'>
          <Card>
            <CardContent className='px-6 py-4'>
              <MarkdownRenderer value={sportsText?.content || ''} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='about'>
          <Card>
            <CardContent className='px-6 py-4'>
              <MarkdownRenderer value={aboutText} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default NewStudent;
