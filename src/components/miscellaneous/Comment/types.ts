import { User } from '../../../types';

/**
 * Values used in forms to comment on posts or comments
 */
export interface FormValues {
  body: string;
}

/**
 * The comment type as it is stored in the database,
 * and used on the website
 */
export interface Comment {
  id: number;
  body: string;
  author: Pick<User, 'first_name' | 'last_name' | 'user_id' | 'image'>;
  created_at: Date;
  updated_at: Date;
  indentation_level: number;
  children: Comment[];
  parent_id: number | null;
  flagged?: boolean;
  collapsed?: boolean;
}
