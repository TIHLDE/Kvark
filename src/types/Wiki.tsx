export type WikiRequired = Partial<WikiPage> & Pick<WikiPage, 'title' | 'slug' | 'path'>;

export type WikiPage = {
  children: Array<WikiChildren>;
  content: string;
  created_at: string;
  image?: string;
  image_alt?: string;
  path: string;
  slug: string;
  title: string;
  updated_at: string;
};

export type WikiChildren = {
  title: WikiPage['title'];
  slug: WikiPage['slug'];
  path: WikiPage['path'];
};

export type WikiTree = {
  slug: string;
  title: string;
  children: Array<WikiTree>;
};
