import { User } from './User';

export type Comment = {
  body: string;
  parent: string | null;
  content_type: CommentContentType;
  content_id: string;
  author: Pick<User, 'image' | 'first_name' | 'last_name'>;
  created_at: string;
  updated_at: string;
  children: Comment[];
  id: string;
};

export type CommentCreate = Pick<Comment, 'body' | 'content_id' | 'content_type' | 'parent'>;

export type CommentUpdate = Pick<Comment, 'body'>;

export type CommentContentType = 'event' | 'news';
