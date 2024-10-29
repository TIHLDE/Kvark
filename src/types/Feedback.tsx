export type Feedback = {
  id: number;
  feedback_type: string;
  title: string;
  description: string;
  created_at: string;
  status: string;
  author: FeedbackAuthor;
};

export type FeedbackAuthor = {
  first_name: string;
  last_name: string;
  image: string;
  user_id: string;
};
