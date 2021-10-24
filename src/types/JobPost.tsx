import { JobPostType } from 'types/Enums';

export type JobPostRequired = Partial<JobPost> & Pick<JobPost, 'body' | 'company' | 'ingress' | 'location' | 'title'>;

export interface JobPost {
  body: string;
  company: string;
  created_at: string;
  deadline: string;
  email: string;
  expired: boolean;
  id: number;
  ingress: string;
  image: string;
  image_alt: string;
  link: string;
  location: string;
  title: string;
  updated_at: string;
  is_continuously_hiring: boolean;
  job_type: JobPostType;
  class_start: number;
  class_end: number;
}
