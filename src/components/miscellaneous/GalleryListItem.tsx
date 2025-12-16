import { Link } from '@tanstack/react-router';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import type { Gallery } from '~/types';
import { urlEncode } from '~/utils';

export type GalleryListItemProps = {
  gallery: Gallery;
};

const GalleryListItem = ({ gallery }: GalleryListItemProps) => (
  <Link to='/galleri/$id/{-$urlTitle}' params={{ id: gallery.id, urlTitle: urlEncode(gallery.title) }}>
    <Card className='h-[1/6]'>
      <CardHeader>
        <CardTitle className='text-black dark:text-white'>{gallery.title}</CardTitle>
        <CardDescription className='h-[40px] line-clamp-2 '>{gallery.description || ''}</CardDescription>
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
