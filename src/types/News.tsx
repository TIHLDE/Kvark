import { UserBase } from '~/types/User';

export type NewsRequired = Omit<Partial<News>, 'creator'> &
  Pick<News, 'title' | 'header' | 'body'> & {
    creator: UserBase['user_id'] | null;
  };

export type Reaction = {
  content_type: string;
  emoji: string;
  object_id: number;
  reaction_id: string;
  user?: Pick<UserBase, 'user_id' | 'first_name' | 'last_name' | 'image'>;
};

export type ReactionMutate = Pick<Reaction, 'emoji' | 'content_type' | 'object_id'>;

export type Emoji = {
  emoji: string;
  count: number;
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
  emojis_allowed?: boolean;
  reactions?: Reaction[];
};
