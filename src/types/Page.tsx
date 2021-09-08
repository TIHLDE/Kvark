export type PageRequired = Partial<Page> & Pick<Page, 'title' | 'slug' | 'path'>;

export interface Page {
  children: Array<PageChildren>;
  content: string;
  created_at: string;
  image?: string;
  image_alt?: string;
  path: string;
  slug: string;
  title: string;
  updated_at: string;
}

export interface PageChildren {
  title: Page['title'];
  slug: Page['slug'];
  path: Page['path'];
}

export interface PageTree {
  slug: string;
  title: string;
  children: Array<PageTree>;
}
