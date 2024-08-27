import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { Gallery } from 'types';

import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';

export type GalleryListItemProps = {
  gallery: Gallery;
};

const GalleryListItem = ({ gallery }: GalleryListItemProps) => (
  <Link to={`${URLS.gallery}${gallery.id}/`}>
    <Card>
      <CardHeader>
        <CardTitle className='text-black dark:text-white'>{gallery.title}</CardTitle>
        {gallery.description && <CardDescription>{gallery.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <AspectRatioImg alt={gallery.image_alt || gallery.title} className='rounded-md' src={gallery.image} />
      </CardContent>
    </Card>
  </Link>
);

export default GalleryListItem;

export const GalleryListItemLoading = () => (
  <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
    {[...Array(6)].map((_, index) => (
      <Skeleton className='h-44' key={index} />
    ))}
  </div>
);
