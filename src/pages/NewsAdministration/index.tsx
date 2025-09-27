import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import NewsEditor from '~/pages/NewsAdministration/components/NewsEditor';
import { PermissionApp } from '~/types/Enums';
import URLS from '~/URLS';
import { ChevronRight, Plus } from 'lucide-react';
import { href, Link, redirect } from 'react-router';

import { Route } from './+types';
import NewsList from './components/NewsList';

export async function clientLoader({ request, params }: Route.ClientActionArgs) {
  const auth = await authClientWithRedirect(request);

  if (!userHasWritePermission(auth.permissions, PermissionApp.NEWS)) {
    return redirect(href('/'));
  }

  return {
    newsId: params.newsId ? Number(params.newsId) : undefined,
  };
}

export default function NewsAdministration({ loaderData }: Route.ComponentProps) {
  const { newsId } = loaderData;

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
                  <Link to={URLS.newsAdmin}>
                    <Plus className='w-5 h-5 stroke-[1.5px]' />
                  </Link>
                </Button>

                <Button asChild className='p-0' variant='link'>
                  <Link to={`${URLS.news}${newsId}/`}>
                    Se nyhet
                    <ChevronRight className='ml-1 w-5 h-5 stroke-[1.5px]' />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <NewsEditor newsId={Number(newsId)} />
      </div>
    </Page>
  );
}
