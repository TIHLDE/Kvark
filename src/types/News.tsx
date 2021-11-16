export type NewsRequired = Partial<News> & Pick<News, 'title' | 'header' | 'body'>;

export type News = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  header: string;
  body: string;
  image?: string;
  image_alt?: string;
};
