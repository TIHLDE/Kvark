import { createFileRoute, Link, linkOptions, useNavigate, useParams } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { ChevronRight, Plus } from 'lucide-react';

import NewsEditor from './components/NewsEditor';
import NewsList from './components/NewsList';

// TODO: Re-add auth protection — previously used authClientWithRedirect() / userHasWritePermission(PermissionApp.NEWS)

export const Route = createFileRoute('/_MainLayout/admin/nyheter/{-$newsId}')({
  component: NewsAdministration,
});

function NewsAdministration() {
  const navigate = useNavigate();
  const { newsId } = useParams({ strict: false });

  const goToNews = (newNews: number | null) => {
    if (newNews) {
      navigate(
        linkOptions({
          to: '/nyheter/$id/{-$urlTitle}',
          params: { id: newNews.toString() },
        }),
      );
    } else {
      navigate(linkOptions({ to: '/admin/nyheter/{-$newsId}' }));
    }
  };

  return (
    <Page className='max-w-6xl mx-auto'>
      <div className='space-y-6'>
        <div className='space-y-4 md:space-y-0 md:flex items-center justify-between'>
          <h1 className='font-bold text-4xl md:text-5xl'>{newsId ? 'Endre nyhet' : 'Ny nyhet'}</h1>

          <div className='flex items-center space-x-4'>
            <NewsList />

            {newsId && (
              <>
                <Button asChild size='icon' variant='outline'>
                  <Link to='/admin/nyheter/{-$newsId}'>
                    <Plus className='w-5 h-5 stroke-[1.5px]' />
                  </Link>
                </Button>

                <Button asChild className='p-0' variant='link'>
                  <Link to='/admin/nyheter/{-$newsId}' params={{ newsId: newsId.toString() }}>
                    Se nyhet
                    <ChevronRight className='ml-1 w-5 h-5 stroke-[1.5px]' />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <NewsEditor goToNews={goToNews} newsId={newsId ? Number(newsId) : null} />
      </div>
    </Page>
  );
}
