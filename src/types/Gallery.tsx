import { EventCompact } from 'types';

export type GalleryRequired = Partial<Gallery> & Pick<Gallery, 'title'>;
export type PictureRequired = Partial<Picture> & Pick<Picture, 'image'>;

export type Gallery = {
  title: string;
  event?: EventCompact;
  image: string;
  slug: string;
  image_alt: string;
  description: string;
};

export type Picture = {
  id: string;
  image: string;
  title: string;
  image_alt: string;
  description: string;
  created_at: string;
  updated_at: string;
};
