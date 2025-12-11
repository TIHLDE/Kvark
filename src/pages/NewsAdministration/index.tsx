import { createFileRoute, Link, linkOptions, redirect, useNavigate, useParams } from '@tanstack/react-router';
import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import NewsEditor from '~/pages/NewsAdministration/components/NewsEditor';
import { PermissionApp } from '~/types/Enums';
import { ChevronRight, Plus } from 'lucide-react';

import NewsList from './components/NewsList';

export const Route = createFileRoute('/_MainLayout/admin/nyheter/{-$newsId}')({
  async beforeLoad({ location }) {
    const auth = await authClientWithRedirect(location.href);

    if (!userHasWritePermission(auth.permissions, PermissionApp.NEWS)) {
      throw redirect({ to: '/' });
    }
  },
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

        <NewsEditor goToNews={goToNews} newsId={Number(newsId)} />
      </div>
    </Page>
  );
}
