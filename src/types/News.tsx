import { UserBase } from 'types/User';

export type NewsRequired = Omit<Partial<News>, 'creator'> &
  Pick<News, 'title' | 'header' | 'body'> & {
    creator: UserBase['user_id'] | null;
  };

export type News = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  creator: UserBase | null;
  header: string;
  body: string;
  image?: string;
  image_alt?: string;
};
