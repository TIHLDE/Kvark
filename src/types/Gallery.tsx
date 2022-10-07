import { EventList } from 'types';
export type GalleryCreate = Pick<Gallery, 'title'>;
export type GalleryRequired = Partial<Gallery> & Pick<Gallery, 'title'>;
export type PictureRequired = Partial<Picture> & Pick<Picture, 'image'>;

export type Gallery = {
  id: string;
  title: string;
  event?: EventList;
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
