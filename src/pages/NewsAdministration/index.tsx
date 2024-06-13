import { ChevronRight, Plus } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';

import NewsEditor from 'pages/NewsAdministration/components/NewsEditor';

import Page from 'components/navigation/Page';
import { Button } from 'components/ui/button';

import NewsList from './components/NewsList';

const NewsAdministration = () => {
  const navigate = useNavigate();
  const { newsId } = useParams();

  const goToNews = (newNews: number | null) => {
    if (newNews) {
      navigate(`${URLS.news}${newNews}/`);
    } else {
      navigate(URLS.newsAdmin);
    }
  };

  return (
    <Page className='max-w-5xl mx-auto'>
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

        <NewsEditor goToNews={goToNews} newsId={Number(newsId)} />
      </div>
    </Page>
  );
};

export default NewsAdministration;
