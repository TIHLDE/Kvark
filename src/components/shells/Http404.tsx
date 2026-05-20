import { Link } from '@tanstack/react-router';
import http404img from '~/assets/img/http404.gif';
import { Button } from '~/components/ui/button';

export type Http404Props = {
  title?: string;
};

export default function Http404({ title = 'Kunne ikke finne siden' }: Http404Props) {
  return (
    <div className='space-y-4 py-10'>
      <img alt='404' className='w-full h-[60vh] object-contain' loading='lazy' src={http404img} />
      <h1 className='text-center text-3xl lg:text-5xl font-bold'>{title}</h1>
      <div className='flex justify-center'>
        <div className='space-x-4'>
          <Button asChild>
            <Link to='/'>Til forsiden</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link to='/tilbakemelding'>Rapporter til Index</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
