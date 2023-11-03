export type Comment = {
  body: string;
  parent: string | null;
  content_type: CommentContentType;
  content_id: string;
  user: string;
  created_at: string;
  updated_at: string;
};

export type CommentCreate = Omit<Comment, 'user' | 'created_at' | 'updated_at'>;

export type CommentContentType = 'event' | 'news';
