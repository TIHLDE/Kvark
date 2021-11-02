export type PhotoAlbumRequired = Partial<Album> & Pick<Album, 'title' | 'slug' | 'event'>;

export interface Album {
  title: string;
  event: string;
  image: string;
  slug: string;
  image_alt: string;
  description: string;
}

export interface Picture {
  id: string;
  image: string;
  title: string;
  image_alt: string;
  description: string;
  created_at: string;
  updated_at: string;
}
