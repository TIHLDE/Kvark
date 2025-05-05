import http404img from '~/assets/img/http404.gif';
import http404ropeImg from '~/assets/img/http404rope.gif';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { useIsAuthenticated } from '~/hooks/User';
import URLS from '~/URLS';
import { Link } from 'react-router';

export type Http404Props = {
  title?: string;
};

const Http404 = ({ title = 'Kunne ikke finne siden' }: Http404Props) => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Page className='space-y-4 py-10'>
      {isAuthenticated ? (
        <img alt='404' className='w-full h-[60vh] object-contain' loading='lazy' src={http404ropeImg} />
      ) : (
        <img alt='404' className='w-full h-[60vh] object-contain' loading='lazy' src={http404img} />
      )}
      <h1 className='text-center text-3xl lg:text-5xl font-bold'>{title}</h1>
      <div className='flex justify-center'>
        <div className='space-x-4'>
          <Button asChild>
            <Link to={URLS.landing}>Til forsiden</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link to={URLS.aboutIndex}>Rapporter til Index</Link>
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default Http404;
