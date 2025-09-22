import { Reaction } from './News';

export type createFeedbackInput = {
  feedback_type: 'Idea' | 'Bug';
  title: string;
  description: string;
};

export type Feedback = {
  id: number;
  feedback_type: 'Idea' | 'Bug';
  title: string;
  created_at: string;
  status: string;
  author: FeedbackAuthor;
  description: string;
  reactions: Reaction[];
  upvotes?: number;
  downvotes?: number;
};

export type FeedbackAuthor = {
  first_name: string;
  last_name: string;
  image: string;
  user_id: string;
};
