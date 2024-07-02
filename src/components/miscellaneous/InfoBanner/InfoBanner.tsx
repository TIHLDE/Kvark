import { Link } from 'react-router-dom';

import { useVisibleInfoBanners } from 'hooks/InfoBanner';

import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';

import AspectRatioImg from '../AspectRatioImg';

const Banner = () => {
  const { data: banners = [], isLoading } = useVisibleInfoBanners();
  const banner = banners.shift();

  if (banner) {
    return (
      <Card className='max-w-3xl w-full mx-auto'>
        <CardContent className='p-4 space-y-4'>
          {isLoading && <Skeleton className='h-96' />}

          {!isLoading && (
            <>
              <AspectRatioImg alt={banner.image_alt || banner.title} borderRadius src={banner.image} />
              <h1 className='text-center text-2xl font-bold'>{banner.title}</h1>
              <p className='text-center'>{banner.description}</p>

              {banner.url && (
                <Button asChild className='w-full text-black dark:text-white' variant='outline'>
                  <Link to={banner.url}>Åpne link</Link>
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default Banner;
