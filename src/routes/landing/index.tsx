import { createFileRoute, Link } from '@tanstack/react-router';
import InfoBanner from '~/components/miscellaneous/InfoBanner/InfoBanner';
import { Button } from '~/components/ui/button';
import { analyticsEvent } from '~/hooks/Utils';
import EventsView from '~/routes/landing/components/EventsView';
import NewsListView from '~/routes/landing/components/NewsListView';
import NewStudentBox from '~/routes/landing/components/NewStudentBox';
import StoriesView from '~/routes/landing/components/StoriesView';
import Wave from '~/routes/landing/components/Wave';
import URLS from '~/URLS';
import { ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/_MainLayout/')({
  component: Landing,
});

function Landing() {
  const openEventsAnalytics = () => analyticsEvent('go-to-all-events', 'events-list-view', `Go to all events`);
  const openNewsAnalytics = () => analyticsEvent('go-to-all-news', 'news-list-view', `Go to all news`);
  return (
    <div>
      <Wave />
      <div className='bg-[#f2f2f2] dark:bg-[#071a2d]'>
        <div className='max-w-5xl w-full mx-auto py-4 space-y-8 px-4'>
          <NewStudentBox />
          <InfoBanner />
          <StoriesView />
        </div>
      </div>
      <div className='max-w-5xl w-full mx-auto py-4 space-y-6 px-4'>
        <div className='flex items-center justify-center space-x-2'>
          <h1 className='text-3xl font-bold'>Arrangementer</h1>
          <Button asChild className='text-black dark:text-white' onClick={openEventsAnalytics} size='icon' variant='ghost'>
            <Link to={URLS.events}>
              <ArrowRight className='w-5 h-5' />
            </Link>
          </Button>
        </div>
        <EventsView />
      </div>
      <div className='bg-[#f2f2f2] dark:bg-[#071a2d]'>
        <div className='max-w-5xl w-full mx-auto py-4 space-y-6 px-4'>
          <div className='flex items-center justify-center space-x-2'>
            <h1 className='text-3xl font-bold'>Nyheter</h1>
            <Button asChild className='text-black dark:text-white' onClick={openNewsAnalytics} size='icon' variant='ghost'>
              <Link to={URLS.news}>
                <ArrowRight className='w-5 h-5' />
              </Link>
            </Button>
          </div>
          <NewsListView />
        </div>
      </div>
    </div>
  );
}
